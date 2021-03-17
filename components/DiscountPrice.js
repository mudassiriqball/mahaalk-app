import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import translate from '../i18n/translate'

export default function DiscountPrice(props) {
    const [discounted_price, setdiscounted_price] = useState(0)

    useEffect(() => {
        let unmounted = true
        let count = props.price - props.discount / 100 * props.price
        let rounded = Math.floor(count);
        let decimal = count - rounded;
        if (decimal > 0 && unmounted) {
            setdiscounted_price(rounded + 1)
        } else if (unmounted) {
            setdiscounted_price(rounded)
        }
        return () => {
            unmounted = false
        }
    }, [props])

    return (
        <View>
            {!props.isShowProuct &&
                <Text style={styles.price_label}>{translate('rs')}{discounted_price}</Text>
            }
            {props.discount != '0' ?
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{
                        width: 'auto',
                        color: 'gray',
                        textDecorationLine: 'line-through',
                        fontSize: props.isShowProuct ? 15 : 12
                    }}>
                        {translate('rs')}
                        {props.price}
                    </Text>
                    <Text style={{ fontSize: props.isShowProuct ? 15 : 12, paddingLeft: 8 }}>{' -' + props.discount + '%'}</Text>
                </View>
                :
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 12 }}>{'-0%'}</Text>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    price_label: {
        display: 'flex',
        padding: '0%',
        marginVertical: 1.5,
        color: 'orange',
        fontSize: 14,
        marginRight: 'auto',
    },
    discount_label: {
        width: 'auto',
        color: 'gray',
        textDecorationLine: 'line-through',
        fontSize: 12,
    }
})
