import React from 'react';
import { FormattedMessage } from 'react-intl'
import { TextInput } from 'react-native-paper';
import Colors from '../constants/Colors';

const TranslateTextInput = (props) =>
    <FormattedMessage id={props.id}>
        {msg =>
            <TextInput
                mode='outlined'
                style={{ marginVertical: 5, backgroundColor: 'white' }}
                label={props.label}
                underlineColor={Colors.primary_color}
                theme={{ colors: { primary: Colors.primary_color } }}
                type={props.type}
                value={props.value}
                placeholder={msg}
                onChangeText={props.onChangeText}
                onBlur={props.onBlur}
                secureTextEntry={props.secureTextEntry}
                onKeyPress={props.onKeyPress}
                disabled={props.disabled}
                autoCompleteType={props.autoCompleteType}
                keyboardType={props.keyboardType}
                textContentType={props.textContentType}
                left={props.left}
                right={props.right}
                error={props.error}
                style={{ width: '100%' }}
            />
        }
    </FormattedMessage>

export default TranslateTextInput
