import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import userOrders from '../hooks/userOrders'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'
import translate from '../i18n/translate';
import Colors from '../constants/Colors';
import Padding from '../constants/Padding';
import { Button, Card, TextInput } from 'react-native-paper';
import Loading from '../components/Loading';
import NoDataFound from '../components/NoDataFound';

export default function OrdersScreen(props) {
    const { status } = props.route.params;

    const [pageNumber, setPageNumber] = useState(1)
    const [orders, setOrders] = useState([])
    const [unmounted, setunmounted] = useState(true)

    const { user_orders_loading, user_orders_error, user_orders, user_orders_pages, user_orders_total, user_order_hasMore } =
        userOrders(props.token, props.user._id, status, pageNumber, '5')

    useEffect(() => {
        setOrders([])
        user_orders.forEach((element, index) => {
            getProducts(element, index)
        })
        return () => {
            setOrders([])
            setunmounted(false)
        }
    }, [user_orders])

    async function getProducts(element, index) {
        let _order = {}
        _order['_id'] = element._id
        _order['sub_total'] = element.sub_total
        _order['shipping_charges'] = element.shipping_charges
        _order['entry_date'] = element.entry_date
        let array = []

        for (const e of element.products) {
            let obj = {}
            const url = MuhalikConfig.PATH + `/api/products/any/product-by-id/${e.p_id}`;
            await axios.get(url).then(res => {
                let data = res.data.data[0]
                obj['product'] = data
                obj['quantity'] = e.quantity
                obj['price'] = e.price

                if (data.product_type != "simple-product") {
                    data.product_variations.forEach((ee, ii) => {
                        if (ee._id == e.variation_id) {
                            obj['variation'] = ee
                            return
                        }
                    })
                }
            }).catch((error) => {
                console.log('Error', error)
            })
            array.push(obj)
        }
        _order['products'] = array

        setOrders(prevOrder => {
            return [...new Set([...prevOrder, _order])]
        })
    }

    function loadMored() {
        if (!user_orders_loading && user_order_hasMore) {
            setPageNumber(pageNumber + 1)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading_text}>{
                status == 'pending' ?
                    translate('pending_orders')
                    :
                    status == 'cancelled' ?
                        translate('cancelled_orders')
                        :
                        status == 'delivered' ?
                            translate('delivered_orders')
                            :
                            translate('returned_orders')
            }</Text>
            {user_orders_total > 0 ?
                <>
                    {status == 'pending' ?
                        <View style={{ margin: 10, }}>
                            <Text style={{ fontSize: '14px', color: Colors.primary_color, textAlign: 'center' }}>{translate('for_cancel_order')}</Text>
                        </View>
                        :
                        null
                    }
                    {orders && orders.map((element, index) =>
                        <Card key={index} style={styles.card}>
                            <CardBody element={element} status={props.status} index={index} />
                        </Card>
                    )}
                    {user_order_hasMore &&
                        <Button onPress={loadMored} loading={user_orders_loading} color={'white'} style={{ backgroundColor: Colors.primary_color, marginBottom: 20 }}>
                            {translate('load_more')}
                        </Button>
                    }
                    {user_orders_loading && <Loading />}
                </>
                :
                user_order_hasMore ?
                    <Loading />
                    :
                    <NoDataFound />
            }
        </View>
    )
}

function CardBody(props) {

    let element = props.element
    let index = element.index
    return (
        <Card.Content style={{ paddingHorizontal: Padding.page_horizontal, paddingVertical: Padding.page_horizontal }}>
            <View>
                <View style={styles.inline}>
                    <Text style={styles.text}>{translate('order_id')}:</Text>
                    <Text style={styles.text_val}>{element._id}</Text>
                </View>
                <View style={styles.inline}>
                    <Text style={styles.text}>{translate('sub_total')}:</Text>
                    <Text style={styles.text_val}>{element.sub_total}</Text>
                </View>
                <View style={styles.inline}>
                    <Text style={styles.text}>{translate('placed_on')}:</Text>
                    <Text style={styles.text_val}>{element.entry_date.substring(0, 10)}</Text>
                </View>
            </View>
            {element.products && element.products.map((e, i) =>
                <Card key={i} style={{ padding: '1%', marginVertical: 5 }}>
                    {e.product.product_type == "simple-product" ?
                        <View style={styles.inline}>
                            <View style={{ borderColor: 'gray', borderWidth: 1, padding: 3 }}>
                                <Image
                                    style={{ height: 100, width: 85 }}
                                    source={{ uri: e.product.product_image_link[0].url }}
                                    defaultSource={require('../assets/images/logo.jpg')}
                                />
                            </View>
                            <View style={styles.vertical}>
                                <Text >{e.product.product_name.substring(0, 30)}{e.product.product_name.length > 30 ? '...' : null}</Text>
                                <Text>{translate('rs')}{e.price}</Text>
                                <Text >{translate('quan')}: {e.quantity}</Text>
                            </View>
                        </View>
                        :
                        <View style={styles.inline}>
                            <View style={{ borderColor: 'gray', borderWidth: 1, padding: 3 }}>
                                <Image
                                    style={{ height: 100, width: 85 }}
                                    source={{ uri: e.variation.image_link[0].url }}
                                    defaultSource={require('../assets/images/logo.jpg')}
                                />
                            </View>
                            <View style={styles.vertical}>
                                <Text>{e.product.product_name.substring(0, 30)}{e.product.product_name.length > 30 ? '...' : null}</Text>
                                <Text>{translate('rs')}{e.variation.price * e.quantity}</Text>
                                <Text >{translate('quan')}: {e.quantity}</Text>
                            </View>
                        </View>
                    }
                </Card>
            )}

        </Card.Content>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: Padding.page_horizontal,
    },
    heading_text: {
        backgroundColor: 'white',
        color: Colors.primary_color,
        fontSize: 16,
        textAlign: 'center',
        marginVertical: Padding.page_horizontal,
        padding: Padding.page_horizontal,
    },
    card: {
        marginBottom: 20,
        paddingHorizontal: 0,
        backgroundColor: Colors.primary_color,
    },
    inline: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 3,
    },
    vertical: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    text: {
        fontSize: 14,
        marginRight: 'auto',
        color: Colors.primary_text_color,
    },
    text_val: {
        fontSize: 13,
        color: 'lightgray',
    },
});