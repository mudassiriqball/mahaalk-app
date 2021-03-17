import React from 'react'
import { StatusBar } from 'react-native'
import Colors from '../constants/Colors'

export default function CustomStatusBar() {
    return (
        <StatusBar backgroundColor={Colors.primary_color} barStyle='light-content' />
    )
}
