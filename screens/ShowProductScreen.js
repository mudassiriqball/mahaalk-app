import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Picker, FlatList, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Rating } from 'react-native-ratings';
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'
import Colors from '../constants/Colors'
import useQueryInfiniteScroll from '../hooks/useQueryInfiniteScroll'
import { AntDesign } from '@expo/vector-icons';
import translate from '../i18n/translate'
import DiscountPrice from '../components/DiscountPrice';

import CalculateDiscountPrice from '../hooks/calculateDiscountPrice';
import capitalize from '../hooks/capitalize';
import CustomButton from '../shared/custom-button';
import Padding from '../constants/Padding'
import Loading from '../components/Loading';
import { List, DataTable, Button } from 'react-native-paper';
import FullWidthCustomButton from '../shared/full-width-custom-button';
import NoDataFound from '../components/NoDataFound';
import ProductCard from '../components/ProductCard';
import TranslateTextInput from '../i18n/translate-text-inputl';
import Layout from '../components/Layout'
import toastAndroid from '../components/toastAndroid'

const SCREEN_WIDTH = Dimensions.get('window').width - (Padding.page_horizontal * 2) - 10;
const SCREEN_HEIGHT = Dimensions.get('window').height - 100;

export default function ShowProductScreen(props) {
    const { _id, sub_category, vendor_id } = props.route.params;
    const [single_product, setSingle_product] = useState('')
    const [productLoading, setProductLoading] = useState(true)

    const [vendor, setVendor] = useState({})
    const [_loading, cartLoading] = useState(false)
    const [isWishListLoading, setIsWishListLoading] = useState(false)

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function getData() {
            const url_1 = MuhalikConfig.PATH + `/api/products/product-by-id/${_id}`;
            await axios.get(url_1).then((res) => {
                setSingle_product(res.data.data[0])
                setProductLoading(false)
            }).catch((err) => {
                console.log('err:', err)
                setProductLoading(false)
            })
        }

        if (props.single_product != '') {
            getVendor()
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, []);

    async function getVendor() {
        const url = MuhalikConfig.PATH + `/api/users/user-by-id/${vendor_id}`;
        await axios.get(url).then((res) => {
            setVendor(res.data.data[0])
        }).catch((err) => {
            console.log('get product error:', err)
        })
    }

    async function addToWishlist(product_id, variation_id) {
        if (props.user.full_name == '') {
            props.navigation.navigate('Login')
        } else {
            setIsWishListLoading(true)
            let data = []
            if (variation_id == null) {
                data = {
                    product_id: product_id,
                }
            } else {
                data = {
                    product_id: product_id,
                    variation_id: variation_id,
                }
            }
            const url = MuhalikConfig.PATH + `/api/users/add-to-wishlist/${props.user._id}`;
            await axios.put(url, data, {
                headers: {
                    'authorization': props.token,
                }
            }).then(function (res) {
                props.reloadUser()
                setIsWishListLoading(false)
            }).catch(function (err) {
                setIsWishListLoading(false)
                alert('ERROR')
            });
        }
    }

    async function removeToWishlist(obj_id) {
        if (props.user.full_name == '') {
            props.navigation.navigate('Login')
        } else {
            setIsWishListLoading(true)
            const _url = MuhalikConfig.PATH + `/api/users/delete/user-wishlist/${props.user._id}`;
            axios({
                method: 'PUT',
                url: _url,
                params: { object_id: obj_id },
                headers: {
                    'authorization': props.token,
                }
            }).then(res => {
                props.reloadUser()
                setIsWishListLoading(false)
            }).catch(err => {
                setIsWishListLoading(false)
                alert('ERROR')
            })
        }
    }

    async function handleAddToCart(quantity, product_id, variation_id, index) {
        let data = {
            p_id: product_id,
            variation_id: variation_id,
            index: index,
            quantity: quantity
        }
        if (props.user.full_name == '') {
            props.navigation.navigate('Login')
        } else {
            cartLoading(true)
            const url = MuhalikConfig.PATH + `/api/users/add-to-cart/${props.user._id}`;
            await axios.put(url, data, {
                headers: {
                    'authorization': props.token,
                }
            }).then(function (res) {
                cartLoading(false)
                if (props.currLang == 'en') {
                    toastAndroid(true, 'Product successfully added to cart')
                } else {
                    toastAndroid(true, 'تم اضافة المنتجات الى العربة بنجاح')
                }
                props.reloadUser()
            }).catch(function (err) {
                console.log('error:', err)
                cartLoading(false)
                alert('Error')
            });
        }
    }

    async function reloadProduct() {
        const url_1 = MuhalikConfig.PATH + `/api/products/product-by-id/${_id}`;
        await axios.get(url_1).then((res) => {
            setSingle_product(res.data.data[0])
        }).catch((err) => {
        })
    }

    return (
        <Layout navigation={props.navigation}>
            {productLoading ?
                <View style={{ minHeight: SCREEN_HEIGHT }}>
                    <Loading />
                </View>
                :
                single_product == '' ?
                    <View style={{ flex: 1, minHeight: SCREEN_HEIGHT, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <Text>{translate('out_of_stock')}</Text>
                        <Text>{translate('we_are_sorry_product')}</Text>
                    </View>
                    :
                    <View>
                        {single_product.product_type == "simple-product" ?
                            <SimpleProduct
                                currLang={props.currLang}
                                single_product={single_product}
                                vendor={vendor}
                                token={props.token}
                                user={props.user}
                                addToWishlist={addToWishlist}
                                removeToWishlist={removeToWishlist}
                                handleAddToCart={handleAddToCart}
                                loading={_loading}
                                reloadProduct={reloadProduct}
                                isWishListLoading={isWishListLoading}
                            />
                            :
                            <VariableProduct
                                currLang={props.currLang}
                                single_product={single_product}
                                vendor={vendor}
                                token={props.token}
                                user={props.user}
                                addToWishlist={addToWishlist}
                                removeToWishlist={removeToWishlist}
                                handleAddToCart={handleAddToCart}
                                loading={_loading}
                                reloadProduct={reloadProduct}
                                isWishListLoading={isWishListLoading}
                            />
                        }
                        <RelatedProducts
                            sub_category={sub_category}
                            current_product_id={single_product._id}
                            navigation={props.navigation}
                        />
                    </View>
            }
        </Layout>
    )
}
function SimpleProduct(props) {
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    let rating_review = {
        rating: {
            overall: 0,
            one_star: 0,
            two_star: 0,
            three_star: 0,
            four_star: 0,
            five_star: 0
        },
        reviews: []
    }
    if ('rating_review' in props.single_product) {
        rating_review = props.single_product.rating_review;
    }
    const [quantity, setQuantity] = useState(1)

    function handleSetQuantityMinus() {
        setQuantity(quantity - 1)
    }
    function handleSetQuantityPlus() {
        setQuantity(quantity + 1)
    }

    const [isInWishlist, setIsInWishlist] = useState(false)
    const [wish_list_obj_id, setwish_list_obj_id] = useState('')

    useEffect(() => {
        setIsInWishlist(false)
        props.user.wish_list && props.user.wish_list.forEach((element, index) => {
            if (element.product_id == props.single_product._id) {
                setIsInWishlist(true)
                setwish_list_obj_id(element._id)
                return
            }
        })
        return () => {
        }
    }, [props])

    return (
        <View style={{ flex: 1 }}>
            <View>
                <View style={styles.main_image_view}>
                    <View style={styles.images_row}>
                        {props.single_product.product_image_link && props.single_product.product_image_link.map((element, index) =>
                            <MyImages key={index}
                                element={element}
                                index={index == activeImageIndex}
                                setData={() => setActiveImageIndex(index)}
                            />
                        )}
                    </View>
                    <Image
                        style={styles.image}
                        source={{ uri: props.single_product.product_image_link[activeImageIndex] ? props.single_product.product_image_link[activeImageIndex].url : '' }}
                        defaultSource={require('../assets/images/logo.jpg')}
                    />
                </View>
                <View style={styles.product_info}>
                    <Text style={styles.product_name}>{props.single_product.product_name}</Text>
                    <View style={styles.price_slope}>
                        <Text style={[styles.text_center, { color: Colors.primary_text_color }]}>
                            {translate('rs')}
                            <CalculateDiscountPrice price={props.single_product.product_price} discount={props.single_product.product_discount} />
                        </Text>
                    </View>
                    {props.single_product.product_discount > 0 &&
                        <DiscountPrice price={props.single_product.product_price} discount={props.single_product.product_discount} isShowProuct={true} />
                    }
                    <View style={styles.rating_reviews}>
                        <View style={styles.width_fifty}>
                            <Rating
                                type='star'
                                showRating
                                ratingCount={5}
                                imageSize={20}
                                fractions={2}
                                startingValue={rating_review.rating.overall}
                                style={styles.zero_padding_margin}
                            />
                        </View>
                        <View style={styles.review_view}>
                            <Text style={styles.reviews_text}>{translate('reviews')}</Text>
                            <Text style={styles.reviews_count_text}>{rating_review.reviews.length}</Text>
                        </View>
                    </View>
                    {props.user.role == 'customer' || props.user.role == '' ?
                        isInWishlist ?
                            <View style={styles.wishlist_view}>
                                <Text style={styles.wishlist_text}>{props.isWishListLoading ? translate('removing') : translate('remove_to_wishlist')}</Text>
                                <TouchableOpacity onPress={() => props.removeToWishlist(wish_list_obj_id)}>
                                    <AntDesign name="heart" size={24} color='orange' />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.wishlist_view}>
                                <Text style={styles.wishlist_text}>{props.isWishListLoading ? translate('adding') : translate('add_to_wishlist')}</Text>
                                <TouchableOpacity onPress={() => props.addToWishlist(props.single_product._id, null)}>
                                    <AntDesign name="heart" size={24} color='gray' />
                                </TouchableOpacity>
                            </View>
                        :
                        null
                    }

                    <View style={styles.stock_view}>
                        <Text style={styles.only_color}>{translate('available_in_stock')}</Text>
                        <Text style={styles.only_color}>{translate('stock')}: {props.single_product.product_in_stock}</Text>
                    </View>
                    {props.single_product.product_brand_name != '' &&
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                            <Text style={[styles.only_color, { marginRight: 'auto', paddingLeft: 3 }]}>{translate('brand')}: </Text>
                            <Text style={[styles.only_color, { paddingRight: 3, marginRight: 'auto' }]}>{props.single_product.product_brand_name}</Text>
                        </View>
                    }
                    {props.single_product.product_warranty > 0 ?
                        <View style={styles.stock_brand_view}>
                            <Text style={[styles.only_color, { marginRight: 'auto', marginLeft: 1 }]}> {translate('warranty')} : {props.single_product.product_warranty}</Text>
                            <Text style={[styles.only_color, { paddingRight: 3, marginRight: 'auto' }]}>{props.single_product.warranty_type}</Text>
                        </View>
                        :
                        <View>
                            <Text style={[styles.only_color, { marginVertical: 8 }]}>{translate('no_warranty')}</Text>
                        </View>
                    }

                    <List.AccordionGroup>
                        <List.Accordion title={translate('specifications')} id="1" titleStyle={styles.accordin_title} style={{ padding: 0, backgroundColor: Colors.lightblue }}>
                            <View style={{ backgroundColor: Colors.lightblue, paddingBottom: 10 }}>
                                {props.single_product.custom_fields != '' ?
                                    <DataTable>
                                        {props.single_product.custom_fields.map((e, i) =>
                                            <DataTable.Row key={i}>
                                                <DataTable.Cell style={styles.color_font}>{capitalize(e.name)}</DataTable.Cell>
                                                <DataTable.Cell style={styles.color_font}>{e.value}</DataTable.Cell>
                                            </DataTable.Row>
                                        )}
                                    </DataTable>
                                    :
                                    <Text style={styles.text_center}>{translate('no_specifications')}</Text>
                                }
                            </View>
                        </List.Accordion>
                        <View style={{ height: 10 }}></View>
                        <List.Accordion title={translate('description')} id="2" titleStyle={styles.accordin_title} style={{ padding: 0, backgroundColor: Colors.lightblue }}>
                            <View style={{ backgroundColor: Colors.lightblue, paddingBottom: 10 }}>
                                {props.single_product.product_description != '' ?
                                    <Text style={styles.text_center}>{props.single_product.product_description}</Text>
                                    :
                                    <Text style={styles.text_center}>{translate('no_description')}</Text>
                                }
                            </View>
                        </List.Accordion>
                    </List.AccordionGroup>
                    <View style={{ height: 15 }}></View>

                    <View style={{ flexDirection: 'row', justifyContent: "center", marginBottom: 10 }}>
                        <CustomButton onPress={handleSetQuantityMinus} disabled={quantity == 1}>
                            <AntDesign name="minus" size={15} color={Colors.primary_text_color} />
                        </CustomButton>
                        <Text style={styles.quantity_text}>{quantity}</Text>
                        <CustomButton onPress={handleSetQuantityPlus} disabled={quantity == props.single_product.product_in_stock}>
                            <AntDesign name="plus" size={15} color={Colors.primary_text_color} />
                        </CustomButton>
                    </View>

                    <FullWidthCustomButton disabled={props.loading || props.user.role == 'vendor' || props.user.role == 'admin'}
                        loading={props.loading}
                        onPress={() => props.handleAddToCart(quantity, props.single_product._id, '', '')}>
                        {props.loading ? translate('adding') : translate('add_to_cart')}
                    </FullWidthCustomButton>
                </View>
            </View>
            {/*  Overview / Specification / Review */}
            <TabComponent
                single_product={props.single_product}
                custom_fields={props.single_product.custom_fields}
                {...props}
            />
            <VendorInfo vendor={props.vendor} />
        </View>
    )
}
// Proxima Nova, Helvetica Neue, Arial, sans - serif;
function VariableProduct(props) {
    const [activeVariation, setActiveVariation] = useState(props.single_product.product_variations[0])
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [activeVariationIndex, setActiveVariationIndex] = useState(0)
    const [variation_items_array, setVariation_items_array] = useState([])

    const [selected_items_array, setSelected_items_array] = useState([])

    let rating_review = {
        rating: {
            overall: 0,
            one_star: 0,
            two_star: 0,
            three_star: 0,
            four_star: 0,
            five_star: 0,
        },
        reviews: []
    }

    const [isInWishlist, setIsInWishlist] = useState(false)
    const [wish_list_obj_id, setwish_list_obj_id] = useState('')
    useEffect(() => {
        setIsInWishlist(false)
        setwish_list_obj_id('')
        props.user.wish_list && props.user.wish_list.forEach((element, index) => {
            if (element.product_id == props.single_product._id && element.variation_id == activeVariation._id) {
                setIsInWishlist(true)
                setwish_list_obj_id(element._id)
                return
            }
        })
        return () => {
        }
    }, [props])

    const [quantity, setQuantity] = useState(1)
    function handleSetQuantityMinus() {
        setQuantity(quantity - 1)
    }
    function handleSetQuantityPlus() {
        setQuantity(quantity + 1)
    }

    if ('rating_review' in activeVariation) {
        rating_review = activeVariation.rating_review;
    }
    React.useEffect(() => {
        let array = []
        let array_1 = []
        let array_2 = []
        let array_3 = []
        let obj = {}

        props.single_product.product_variations.forEach((element, index) => {
            element.item.forEach((e, i) => {
                array.push(e)
            })
        })

        array.forEach((element, index) => {
            array_2 = []
            array.forEach((e, i) => {
                if (e.name == element.name) {
                    let found = false
                    array_2 && array_2.forEach((ee, ii) => {
                        if (e.value == ee) {
                            found = true
                            return
                        }
                    })
                    if (!found) {
                        array_2.push(e.value)
                    }
                }
            })

            let found = false
            array_1 && array_1.forEach((e, i) => {
                if (element.name == e.name) {
                    found = true
                    return
                }
            })

            if (!found) {
                obj = {}
                obj['name'] = element.name
                obj['value'] = array_2
                if (array_2.length > 5) {
                    obj['isOptions'] = true
                } else {
                    obj['isOptions'] = false
                }
                array_1.push(obj)
                array_3.push(props.single_product.product_variations[0].item[index].value)
            }
        })
        setSelected_items_array(array_3)
        setVariation_items_array(array_1)

        return () => { }
    }, [props])

    async function handleVariationItemClick(curr_item_index, curr_item_val) {
        let copyArray = []
        copyArray = Object.assign([], selected_items_array)
        copyArray[curr_item_index] = curr_item_val

        let flag = false
        props.single_product.product_variations.forEach((element, index) => {
            let found = false
            copyArray.forEach((e, i) => {
                if (element.item[i].value != e) {
                    found = true
                    return
                }
            })
            if (!found) {
                setSelected_items_array(copyArray)
                setActiveVariation(element)
                setActiveVariationIndex(index)
                setActiveImageIndex(0)
                flag = true
                return
            }
        })
        if (!flag) {
            if (props.currLang == 'en') {
                toastAndroid(true, 'Combination not fount, try changing the variants')
            } else {
                toastAndroid(true, 'الجمع لا ينفع ، حاول تغيير المتغيرات')
            }
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View>
                <View style={styles.main_image_view}>
                    <View style={styles.images_row}>
                        {activeVariation.image_link && activeVariation.image_link.map((element, index) =>
                            <MyImages key={index}
                                element={element}
                                index={index == activeImageIndex}
                                setData={() => setActiveImageIndex(index)}
                            />
                        )}
                    </View>
                    <Image
                        style={styles.image}
                        source={{ uri: activeVariation.image_link[activeImageIndex] ? activeVariation.image_link[activeImageIndex].url : '' }}
                        defaultSource={require('../assets/images/logo.jpg')}
                    />
                </View>
                <View style={styles.product_info}>
                    <Text style={styles.product_name}>{props.single_product.product_name}</Text>
                    <View style={styles.price_slope}>
                        <Text style={[styles.text_center, { color: Colors.primary_text_color }]}>
                            {translate('rs')}
                            <CalculateDiscountPrice price={activeVariation.price} discount={activeVariation.discount} />
                        </Text>
                    </View>
                    {activeVariation.discount > 0 &&
                        <DiscountPrice price={activeVariation.price} discount={activeVariation.discount} isShowProuct={true} />
                    }
                    <View style={styles.rating_reviews}>
                        <View style={styles.width_fifty}>
                            <Rating
                                type='star'
                                showRating
                                ratingCount={5}
                                imageSize={20}
                                fractions={2}
                                startingValue={rating_review.rating.overall}
                                style={styles.zero_padding_margin}
                            />
                        </View>
                        <View style={styles.review_view}>
                            <Text style={styles.reviews_text}>{translate('reviews')}</Text>
                            <Text style={styles.reviews_count_text}>{rating_review.reviews.length}</Text>
                        </View>
                    </View>
                    {props.user.role == 'customer' || props.user.role == '' ?
                        isInWishlist ?
                            <View style={styles.wishlist_view}>
                                <Text style={styles.wishlist_text}>{props.isWishListLoading ? translate('removing') : translate('remove_to_wishlist')}</Text>
                                <TouchableOpacity onPress={() => props.removeToWishlist(wish_list_obj_id)}>
                                    <AntDesign name="heart" size={24} color='orange' />
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.wishlist_view}>
                                <Text style={styles.wishlist_text}>{props.isWishListLoading ? translate('adding') : translate('add_to_wishlist')}</Text>
                                <TouchableOpacity onPress={() => props.addToWishlist(props.single_product._id, activeVariation._id)}>
                                    <AntDesign name="heart" size={24} color='gray' />
                                </TouchableOpacity>
                            </View>
                        :
                        null
                    }

                    <View style={styles.stock_view}>
                        <Text style={styles.only_color}>{translate('available_in_stock')}</Text>
                        <Text style={styles.only_color}>{translate('stock')}: {activeVariation.stock}</Text>
                    </View>
                    <View>
                        {props.single_product.product_brand_name != '' &&
                            <View style={styles.stock_brand_view}>
                                <Text style={[styles.only_color, { marginRight: 'auto', paddingLeft: 3 }]}>{translate('brand')}: </Text>
                                <Text style={[styles.only_color, { marginRight: 'auto' }]}>{props.single_product.product_brand_name}</Text>
                            </View>
                        }
                    </View>

                    <View>
                        {activeVariation.warranty > 0 ?
                            <View style={styles.stock_brand_view}>
                                <Text style={[styles.only_color, { marginRight: 'auto', marginLeft: 1 }]}> {translate('warranty')} : {activeVariation.warranty}</Text>
                                <Text style={[styles.only_color, { marginRight: 'auto' }]}>{activeVariation.warranty_type}</Text>
                            </View>
                            :
                            <Text style={[styles.only_color, { marginVertical: 8 }]}>{translate('no_warranty')}</Text>
                        }
                    </View>

                    <View style={{ backgroundColor: Colors.lightblue, padding: 5, marginBottom: 10 }}>
                        {variation_items_array && variation_items_array.map((element, index) =>
                            <View key={index}>
                                <Text style={[styles.only_color, { marginBottom: 4, fontSize: 13 }]}>{capitalize(element.name)}</Text>
                                {element.isOptions ?
                                    <Picker
                                        selectedValue={selected_items_array[index]}
                                        style={styles.picker}
                                        onValueChange={(itemValue, itemIndex) => handleVariationItemClick(index, itemValue)}
                                    >
                                        {element.value && element.value.map((e, i) =>
                                            <Picker.Item key={i} label={e} value={e} />
                                        )}
                                    </Picker>
                                    :
                                    <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                                        {element.value && element.value.map((e, i) =>
                                            <Button key={i} mode='outlined' key={i} color={e == selected_items_array[index] ? 'white' : '#007BFF'} labelStyle={{ fontSize: 10 }}
                                                style={{ backgroundColor: e == selected_items_array[index] ? '#007BFF' : 'white' }}
                                                onPress={() => { handleVariationItemClick(index, e) }}
                                            >
                                                {e}
                                            </Button>
                                        )}
                                    </View>
                                }
                            </View>
                        )}
                    </View>

                    <List.AccordionGroup>
                        <List.Accordion title={translate('specifications')} id="1" titleStyle={styles.accordin_title} style={{ padding: 0, backgroundColor: Colors.lightblue }}>
                            <View style={{ backgroundColor: Colors.lightblue, paddingBottom: 10 }}>
                                {activeVariation.custom_fields != '' ?
                                    <DataTable>
                                        {activeVariation.custom_fields.map((e, i) =>
                                            <DataTable.Row key={i}>
                                                <DataTable.Cell style={styles.color_font}>{capitalize(e.name)}</DataTable.Cell>
                                                <DataTable.Cell style={styles.color_font}>{e.value}</DataTable.Cell>
                                            </DataTable.Row>
                                        )}
                                    </DataTable>
                                    :
                                    <Text style={styles.text_center}>{translate('no_specifications')}</Text>
                                }
                            </View>
                        </List.Accordion>
                        <View style={{ height: 10 }}></View>
                        <List.Accordion title={translate('description')} id="2" titleStyle={styles.accordin_title} style={{ padding: 0, backgroundColor: Colors.lightblue }}>
                            <View style={{ backgroundColor: Colors.lightblue, paddingBottom: 10 }}>
                                {props.single_product.product_description != '' ?
                                    <Text style={styles.text_center}>{props.single_product.product_description}</Text>
                                    :
                                    <Text style={styles.text_center}>{translate('no_description')}</Text>
                                }
                            </View>
                        </List.Accordion>
                    </List.AccordionGroup>
                    <View style={{ height: 15 }}></View>

                    <View style={{ flexDirection: 'row', justifyContent: "center", marginBottom: 10 }}>
                        <CustomButton onPress={handleSetQuantityMinus} disabled={quantity == 1}>
                            <AntDesign name="minus" size={15} color={Colors.primary_text_color} />
                        </CustomButton>
                        <Text style={styles.quantity_text}>{quantity}</Text>
                        <CustomButton onPress={handleSetQuantityPlus} disabled={quantity == props.single_product.product_in_stock}>
                            <AntDesign name="plus" size={15} color={Colors.primary_text_color} />
                        </CustomButton>
                    </View>

                    <FullWidthCustomButton disabled={props.loading || props.user.role == 'vendor' || props.user.role == 'admin'}
                        loading={props.loading}
                        onPress={() => props.handleAddToCart(quantity, props.single_product._id, activeVariation._id, activeVariationIndex)}>
                        {props.loading ? translate('adding') : translate('add_to_cart')}
                    </FullWidthCustomButton>
                </View>
            </View>
            {/*  Overview / Specification / Review */}
            <TabComponent
                single_product={props.single_product}
                activeVariation={activeVariation}
                activeVariationIndex={activeVariationIndex}
                custom_fields={activeVariation.custom_fields}
                item={activeVariation.item}
                {...props}
            />
            <VendorInfo vendor={props.vendor} />
        </View>
    )
}


function MyImages(props) {
    return (
        <TouchableOpacity onPress={props.setData} style={{ borderWidth: 1, borderColor: props.index ? 'black' : 'lightgray', padding: 1, borderRadius: 3, marginBottom: 5 }}>
            <Image
                style={{
                    width: '100%',
                    height: 55,
                    borderRadius: 3,
                    overflow: 'hidden'
                }}
                source={{ uri: props.element ? props.element.url : '' }}
                defaultSource={require('../assets/images/logo.jpg')}
            />
        </TouchableOpacity>
    )
}

function VendorInfo(props) {
    let rating = {
        overall: 0,
        one_star: 0,
        two_star: 0,
        three_star: 0,
        four_star: 0,
        five_star: 0
    }
    if (props.vendor && 'rating' in props.vendor) {
        rating = props.vendor.rating_review
    }

    return (
        <View style={{ backgroundColor: 'white', paddingVertical: Padding.page_horizontal * 3, paddingHorizontal: Padding.page_horizontal, borderRadius: 5, marginTop: 10, }}>
            <Text style={[styles.text_center, { fontSize: 18, marginBottom: 4 }]}>{translate('shop_info')}</Text>
            <Text style={[styles.text_center, { fontSize: 14, marginBottom: 15 }]}>{props.vendor && 'shop_name' in props.vendor ? props.vendor.shop_name : '-'}</Text>
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.width_fifty}>
                    <Rating
                        type='star'
                        showRating
                        ratingCount={5}
                        imageSize={18}
                        fractions={2}
                        startingValue={rating.overall}
                        style={styles.zero_padding_margin}
                    />
                </View>
                <View style={{ width: '50%', flexDirection: 'column' }}>
                    <View style={styles.stars}>
                        <Text style={styles.rating_star_text}>{rating.one_star}</Text>
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                    </View>
                    <View style={styles.stars}>
                        <Text style={styles.rating_star_text}>{rating.two_star}</Text>
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                    </View>
                    <View style={styles.stars}>
                        <Text style={styles.rating_star_text}>{rating.three_star}</Text>
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                    </View>
                    <View style={styles.stars}>
                        <Text style={styles.rating_star_text}>{rating.four_star}</Text>
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                    </View>
                    <View style={styles.stars}>
                        <Text style={styles.rating_star_text}>{rating.five_star}</Text>
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                        <AntDesign name="staro" size={15} color={Colors.star_color} />
                    </View>
                </View>
            </View>
        </View >
    )
}


function TabComponent(props) {
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [reviewError, setReviewError] = useState('')
    const [loading, setLoading] = useState(false)

    let rating_review = {
        rating: {
            overall: 0,
            one_star: 0,
            two_star: 0,
            three_star: 0,
            four_star: 0,
            five_star: 0
        },
        reviews: []
    }
    if (props.single_product.product_type == "simple-product") {
        if ('rating_review' in props.single_product) {
            rating_review = props.single_product.rating_review;
        }
    } else {
        if ('rating_review' in props.activeVariation) {
            rating_review = props.activeVariation.rating_review;
        }
    }

    function ratingChanged(newRating) {
        setRating(newRating)
    }

    function handleSetRating() {
        setLoading(true)
        let parameters = {}
        if (props.single_product.product_type == "simple-product") {
            parameters = { _id: props.single_product._id }
        } else {
            parameters = {
                _id: props.single_product._id,
                variation_id: props.activeVariation._id,
                variation_index: props.activeVariationIndex
            }
        }
        const _url = MuhalikConfig.PATH + '/api/products/review-rating'
        axios({
            method: 'PUT',
            url: _url,
            headers: { 'authorization': props.token },
            params: parameters,
            data: { rating: rating, review: review, c_name: props.user.full_name }
        }).then(res => {
            props.reloadProduct()
            setRating(0)
            setReview('')
            setLoading(false)
            if (props.currLang == 'en') {
                toastAndroid(true, 'Thanks for rating, Your rating added successfully')
            } else {
                toastAndroid(true, 'شكرا على التقييم ، أضف تقييمك بنجاح')
            }
        }).catch(err => {
            alert('Error')
        })
    }

    function handleSetReview(val) {
        setReview(val)
        setReviewError('')
    }

    return (
        <View style={{ backgroundColor: 'white', padding: Padding.page_horizontal, borderRadius: 5, marginTop: 10, }}>
            <List.AccordionGroup>
                <List.Accordion title={translate('rating')} id="1" titleStyle={styles.accordin_title} style={{ padding: 0, backgroundColor: Colors.lightblue }}>
                    <View style={{ flexDirection: 'row', paddingVertical: 10 }}>
                        <View style={styles.width_fifty}>
                            <Rating
                                type='star'
                                showRating
                                ratingCount={5}
                                imageSize={18}
                                fractions={2}
                                startingValue={rating_review.rating.overall}
                                style={styles.zero_padding_margin}
                            />
                        </View>
                        <View style={{ width: '50%', flexDirection: 'column' }}>
                            <View style={styles.stars}>
                                <Text style={styles.rating_star_text}>{rating_review.rating.one_star || 0}</Text>
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                            </View>
                            <View style={styles.stars}>
                                <Text style={styles.rating_star_text}>{rating_review.rating.two_star | 0}</Text>
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                            </View>
                            <View style={styles.stars}>
                                <Text style={styles.rating_star_text}>{rating_review.rating.three_star || 0}</Text>
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                            </View>
                            <View style={styles.stars}>
                                <Text style={styles.rating_star_text}>{rating_review.rating.four_star || 0}</Text>
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                            </View>
                            <View style={styles.stars}>
                                <Text style={styles.rating_star_text}>{rating_review.rating.five_star || 0}</Text>
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                                <AntDesign name="staro" size={15} color={Colors.star_color} />
                            </View>
                        </View>
                    </View>
                </List.Accordion>

                <View style={{ height: 10 }}></View>

                <List.Accordion title={translate('reviews')} id="2" titleStyle={styles.accordin_title} style={{ padding: 0, backgroundColor: Colors.lightblue }}>
                    <View style={{ paddingVertical: 10 }}>
                        {rating_review.reviews != '' ?
                            rating_review.reviews && rating_review.reviews.map((element, index) =>
                                <View key={index} style={{ padding: 5, marginBottom: 2, borderBottomColor: 'gray', borderBottomWidth: 1 }}>
                                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                        <Text style={{ fontSize: 13, marginRight: 'auto' }}>{element.c_name}</Text>
                                        <Text style={{ fontSize: 13 }}>{element.entry_date.substring(0, 10)}</Text>
                                    </View>
                                    <Text style={styles.color_font}>{element.review}</Text>
                                </View>
                            )
                            :
                            <Text style={styles.text_center}>{translate('no_reviews')}</Text>
                        }
                    </View>
                </List.Accordion>
                <View style={{ height: 10 }}></View>

                {props.user.role != '' && props.user.role == 'customer' ?
                    <List.Accordion title={translate('give_review')} id="3" titleStyle={styles.accordin_title} style={{ padding: 0, backgroundColor: Colors.lightblue }}>
                        <View style={{ paddingVertical: 10 }}>
                            <Rating
                                type='star'
                                showRating
                                ratingCount={5}
                                imageSize={18}
                                startingValue={rating}
                                onFinishRating={ratingChanged}
                                style={styles.zero_padding_margin}
                            />
                            <View style={{ height: 10 }} />
                            <TranslateTextInput
                                id='enter_review'
                                onChangeText={(val) => handleSetReview(val)}
                                error={reviewError}
                                value={review}
                            />
                            <Text style={{ color: Colors.error_color, fontSize: 12 }}>
                                {reviewError}
                            </Text>
                            <View style={{ height: 10 }} />
                            <FullWidthCustomButton onPress={handleSetRating} disabled={!review} loading={loading}>
                                {loading ? translate('rating') : translate('rate')}
                            </FullWidthCustomButton>
                        </View>
                    </List.Accordion>
                    :
                    null
                }
            </List.AccordionGroup>
        </View>
    )
}

function RelatedProducts(props) {
    const { loading, error, products, pages, total, hasMore } = useQueryInfiniteScroll('sub-category', props.sub_category, '1', '6')

    function renderItem({ item }) {
        return (
            <View style={{ padding: 5, width: '33.333%' }}>
                <ProductCard item={item} navigation={props.navigation} numberOfCol={3} />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, marginTop: 10, marginBottom: 20 }}>
            <Text style={[styles.only_color, { marginVertical: 10, paddingLeft: 5 }]}>{translate('related_products')}</Text>
            {total > 0 ?
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    numColumns={3}
                    initialNumToRender={3}
                    renderFooter={() => {
                        return (
                            all_products_loading &&
                            <Loading />
                        );
                    }}
                />
                :
                hasMore ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    main_image_view: {
        flexDirection: "row",
        backgroundColor: 'white',
        padding: Padding.page_horizontal,
        borderRadius: 5,
    },
    images_row: {
        flexDirection: 'column',
        width: '15%',
        overflow: 'scroll',
        height: SCREEN_WIDTH,
        paddingRight: 5,
    },
    image: {
        width: '85%',
        height: SCREEN_WIDTH,
        borderRadius: 5,
        overflow: 'hidden'
    },
    product_info: {
        backgroundColor: 'white',
        padding: Padding.page_horizontal,
        marginTop: 10,
        borderRadius: 5,
    },
    product_name: {
        fontSize: 18,
        color: 'gray'
    },
    price_slope: {
        width: SCREEN_WIDTH - 50,
        padding: 10,
        marginTop: 10,
        backgroundColor: Colors.primary_color,
        borderBottomEndRadius: 50,
    },
    rating_reviews: {
        marginVertical: 10,
        flexDirection: 'row'
    },
    review_view: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
    },
    wishlist_view: {
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stock_view: {
        backgroundColor: Colors.lightblue,
        padding: 10,
    },
    stars: {
        flexDirection: 'row'
    },
    rating_star_text: {
        color: 'gray',
        fontSize: 13,
        marginRight: 5
    },
    accordin_title: {
        color: 'gray',
        fontSize: 15,
    },
    picker_view: {
        flex: 1,
        alignItems: "center",
    },
    picker: {
        height: 50,
        width: '90%',
        marginVertical: '2%',
        borderColor: 'white'
    },
    stock_brand_view: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15
    },
    color_font: {
        color: 'gray',
        fontSize: 13
    },
    quantity_text: {
        backgroundColor: 'lightgray',
        maxWidth: 80,
        minWidth: 50,
        textAlign: 'center',
        textAlignVertical: "center"
    },
    text_center: {
        textAlign: 'center'
    },
    review_view: {
        color: Colors.star_color,
        fontSize: 15,
        marginBottom: 0
    },
    reviews_count_text: {
        color: Colors.star_color,
        fontSize: 25
    },
    wishlist_text: {
        color: 'gray',
        marginRight: 10,
        fontSize: 15
    },
    zero_padding_margin: {
        padding: 0,
        margin: 0
    },
    width_fifty: {
        width: '50%'
    },
    only_color: {
        color: 'gray'
    },
})

