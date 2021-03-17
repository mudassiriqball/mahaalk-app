import React from 'react'
import translate from '../i18n/translate'
import { View, Text } from 'react-native'

export default function NoDataFound() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View>
                <Text style={{ textAlign: 'center' }}>{translate('no_data_found')}</Text>
            </View>
        </View>
    )
}
