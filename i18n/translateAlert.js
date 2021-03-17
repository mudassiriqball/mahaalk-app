import React from 'react';
import { Alert } from 'react-native'
import { FormattedMessage } from 'react-intl'

const translateAlert = (id) =>
    <FormattedMessage id={id}>
        {msg => {
            Alert.alert('llll');
        }
        }
    </FormattedMessage>

export default translateAlert



