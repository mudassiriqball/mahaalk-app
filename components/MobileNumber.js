import React from 'react'
import { View, Picker } from 'react-native'
import { TextInput } from 'react-native-paper'
import translate from '../i18n/translate'
import Colors from '../constants/Colors'


export default function MobileNumber(props) {
    return (
        <View style={{ flexDirection: 'row', width: '100%', marginVertical: 5 }}>
            <View style={{
                maxWidth: '30%', minWidth: '30%',
                marginTop: 6, minHeight: 58,
                backgroundColor: Colors.primary_color,
                borderRadius: 5
            }}>
                <Picker
                    selectedValue={props.countryCode}
                    style={{
                        width: '100%',
                        minHeight: 58,
                        color: 'white',
                        overflow: 'visible'
                    }}
                    disabled={props.disabled}
                    onValueChange={value => props.setCountryCode(value)}
                >
                    <Picker.Item label="+966" value="+966" />
                    <Picker.Item label="+92" value="+92" />
                </Picker>
            </View>
            <View style={{ maxWidth: '70%', minWidth: '70%' }}>
                <TextInput
                    mode='outlined'
                    placeholder='590911771'
                    label={translate('mobile')}
                    value={props.value}
                    onChangeText={props.onChangeText}
                    underlineColor={Colors.primary_color}
                    style={{ backgroundColor: 'white', }}
                    theme={{ colors: { primary: Colors.primary_color } }}
                    onBlur={props.onBlur}
                    keyboardType="phone-pad"
                    textContentType="telephoneNumber"
                    disabled={props.disabled}
                />
            </View>
        </View>
    )
}
