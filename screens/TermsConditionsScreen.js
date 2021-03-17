import React from 'react'
import { View, Text } from 'react-native'
import translate from '../i18n/translate'

export default function TermsConditionsScreen() {
    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <Text>{translate('no_data_found')}</Text>
        </View>
    )
}
