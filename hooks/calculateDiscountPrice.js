import React, { useState, useEffect } from 'react'

export default function CalculateDiscountPrice(props) {
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
        }
    }, [props])

    return (discounted_price)
}
