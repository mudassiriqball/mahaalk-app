import React from 'react'
import { Button } from 'react-native-paper'
import { StyleSheet } from 'react-native'
import Colors from '../constants/Colors'

export default function FullWidthCustomButton(props) {
    return (
        <Button
            style={styles.button}
            loading={props.loading}
            icon={props.icon}
            mode={props.mode}
            onPress={props.onPress}
            disabled={props.disabled}
            uppercase={false}
            labelStyle={{ color: props.disabled ? 'lightgray' : Colors.primary_text_color }}
        >
            {props.children}
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.primary_color,
        width: '100%',
    },
})