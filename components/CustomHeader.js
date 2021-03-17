import React from 'react'
import { Text, View } from 'react-native'
import Colors from '../constants/Colors'


export default function CustomHeader(props) {
    return (
        <View style={{ backgroundColor: Colors.primary_color, height: 64, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, color: Colors.primary_text_color }}>{props.title}</Text>
        </View>
    )
}
