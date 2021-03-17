import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import Colors from '../constants/Colors'

export default function Loading() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
            <ActivityIndicator size="large" color={Colors.primary_color} />
        </View>
    )
}
