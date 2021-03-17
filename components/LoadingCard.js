import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import DiscountPrice from './DiscountPrice';

export default function LoadingCard() {
    return (
        <View style={styles.product_container}>
            <Image
                style={{ height: 150, width: '100%' }}
                source={require('../assets/images/logo.jpg')}
                defaultSource={require('../assets/images/logo.jpg')}
            />
            <View style={{ padding: 5 }}>
                <Text style={styles.product_labels} numberOfLines={1}>{'-'}</Text>
                <DiscountPrice price={0} discount={0} />
            </View>
        </View>
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
