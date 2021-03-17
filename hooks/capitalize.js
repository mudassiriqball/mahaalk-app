import React from 'react'

const capitalize = (str) => {
    if (typeof str !== 'string') return ''
    let lower = str.substring(1, str.length)
    return str.charAt(0).toUpperCase() + lower.toLocaleLowerCase()
}

export default capitalize