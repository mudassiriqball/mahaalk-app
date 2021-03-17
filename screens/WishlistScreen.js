import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'
import NoDataFound from '../components/NoDataFound'
import Padding from '../constants/Padding'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import DiscountPrice from '../components/DiscountPrice'
import translate from '../i18n/translate'
import Colors from '../constants/Colors'

export default function WishlistScreen(props) {
    const [my_wishlist, setMy_wishlist] = useState([])

    useEffect(() => {
        setMy_wishlist([])
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        if (props.user.role != 'customer') {
            props.navigation.navigate('Root', { screen: 'Home' })
        } else {
            props.user.wish_list && props.user.wish_list.forEach((element, index) => {
                getProducts(element, index)
            })
        }

        async function getProducts(element, index) {
            const url = MuhalikConfig.PATH + `/api/products/product-by-id/${element.product_id}`;
            await axios.get(url, { cancelToken: source.token }).then(res => {
                if (unmounted) {
                    let obj = {}
                    obj['_id'] = element._id
                    obj['product_id'] = element.product_id
                    obj['variation_id'] = element.variation_id
                    obj['product'] = res.data.data[0]
                    obj['isLoading'] = false

                    if (res.data.data[0].product_type != "simple-product") {
                        res.data.data[0].product_variations.forEach((e, i) => {
                            if (e._id == element.variation_id) {
                                obj['variation'] = e
                            }
                        })
                    }
                    setMy_wishlist(prev => {
                        return [...new Set([...prev, obj])]
                    })
                }
            }).catch((error) => {
                console.log("product getting error:", error)
                if (unmounted) {
                    alert('Error')
                }
            })
        }

        return () => {
        }
    }, [props.user.wish_list])

    async function removeToWishlist(obj_id) {
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
        }).catch(err => {
            console.log('remove to wishlist error:', err)
            alert('ERROR')
        })
    }

    return (
        <View style={{ flex: 1 }}>
            {my_wishlist == '' ?
                <NoDataFound />
                :
                <View style={{ flex: 1, margin: Padding.page_horizontal }}>
                    {my_wishlist && my_wishlist.map((element, index) =>
                        <View key={index} style={{
                            borderColor: element.err ? Colors.error_color : null, borderWidth: element.err ? 1 : null,
                            backgroundColor: 'white', borderRadius: 5, padding: Padding.page_horizontal, marginBottom: 5
                        }}>
                            {element.product.product_type == "simple-product" ?
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: '30%', paddingVertical: 5, paddingRight: 4 }}>
                                        <Image
                                            style={{ maxHeight: 100, minHeight: 100, borderRadius: 5, overflow: "hidden" }}
                                            source={element.product.product_image_link[0] ? { uri: element.product.product_image_link[0].url } : ''}
                                            defaultSource={require('../assets/images/logo.jpg')}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'column', width: '70%', paddingVertical: 5, paddingLeft: 4 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
                                                <TouchableOpacity
                                                    onPress={() => props.navigation.navigate('ShowProduct', { _id: element.product._id, sub_category: element.product.sub_category.value, vendor_id: element.product.vendor_id })}>
                                                    <Text style={{ color: 'blue', marginRight: 20 }}>{translate('view')}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => removeToWishlist(element._id)}>
                                                    <Text style={{ color: Colors.error_color }}>{element.isLoading ? translate('deleting') : translate('delete')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text numberOfLines={2}>{element.product.product_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <DiscountPrice price={element.product.product_price} discount={element.product.product_discount} />
                                        </View>
                                        <Text>{element.quantity}</Text>
                                    </View>
                                </View>
                                :
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: '30%', paddingVertical: 5, paddingRight: 4 }}>
                                        <Image
                                            style={{ maxHeight: 100, minHeight: 100, borderRadius: 5, overflow: "hidden" }}
                                            source={element.variation.image_link[0] ? { uri: element.variation.image_link[0].url } : ''}
                                            defaultSource={require('../assets/images/logo.jpg')}
                                        />
                                    </View>
                                    <View style={{ flexDirection: 'column', width: '70%', paddingVertical: 5, paddingLeft: 4 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
                                                <TouchableOpacity
                                                    onPress={() => props.navigation.navigate('ShowProduct', { _id: element.product._id, sub_category: element.product.sub_category.value, vendor_id: element.product.vendor_id })}>
                                                    <Text style={{ color: 'blue', marginRight: 20 }}>{translate('view')}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => removeToWishlist(element._id)}>
                                                    <Text style={{ color: Colors.error_color }}>{element.isLoading ? translate('deleting') : translate('delete')}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        <Text numberOfLines={2}>{element.product.product_name}</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <DiscountPrice price={element.variation.price} discount={element.variation.discount} />
                                        </View>
                                        <Text>{element.quantity}</Text>
                                    </View>
                                </View>
                            }
                        </View>
                    )}
                </View>

            }
        </View>
    )
}
