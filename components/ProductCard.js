import React from 'react'
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Card } from 'react-native-paper';
import DiscountPrice from './DiscountPrice';

export default function ProductCard(props) {
    const SCREEN_WIDTH = Dimensions.get('window').width;
    const IMAGE_HEIGHT = props.numberOfCol == 2 ? SCREEN_WIDTH / 2 : props.layout == 'small' ? (SCREEN_WIDTH / 3) - 15 : SCREEN_WIDTH / 3;

    let item = props.item
    return (
        <TouchableOpacity style={{
            borderRadius: 5,
            overflow: 'hidden',
            padding: 0,
            backgroundColor: 'white',
        }}
            onPress={() => props.navigation.push('ShowProduct', { _id: item._id, sub_category: item.sub_category.value, vendor_id: item.vendor_id })}
        >
            <View style={{ padding: 0, margin: 0 }}>
                {item.product_type != 'simple-product' ?
                    <>
                        <Image
                            style={{ minHeight: IMAGE_HEIGHT + 10, maxHeight: IMAGE_HEIGHT + 10, minWidth: '100%', maxWidth: '100%' }}
                            source={{ uri: item.product_variations[0] ? item.product_variations[0].image_link[0].url : '' }}
                            defaultSource={require('../assets/images/logo.jpg')}
                        />
                        <View style={{ padding: 5 }}>
                            <Text style={styles.product_labels} numberOfLines={1}>{item.product_name}</Text>
                            <DiscountPrice price={item.product_variations[0].price} discount={item.product_variations[0].discount} isShowProuct={false} />
                        </View>
                    </>
                    :
                    <>
                        <Image
                            style={{ minHeight: IMAGE_HEIGHT + 10, maxHeight: IMAGE_HEIGHT + 10, minWidth: '100%', maxWidth: '100%' }}
                            source={{ uri: item.product_image_link[0] ? item.product_image_link[0].url : '' }}
                            defaultSource={require('../assets/images/logo.jpg')}
                        />
                        <View style={{ padding: 5 }}>
                            <Text style={styles.product_labels} numberOfLines={1}>{item.product_name}</Text>
                            <DiscountPrice price={item.product_price} discount={item.product_discount} isShowProuct={false} />
                        </View>
                    </>
                }
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    product_container: {
        backgroundColor: 'white',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 20,
    },
    product_labels: {
        color: 'gray',
        backgroundColor: 'white',
        fontSize: 12,
    },
});