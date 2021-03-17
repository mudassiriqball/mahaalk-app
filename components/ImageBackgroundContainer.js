import React from 'react'
import { View, StyleSheet, ImageBackground } from "react-native";
import { Avatar } from "react-native-paper";
import Padding from "../constants/Padding";
import Colors from '../constants/Colors'

export default function ImageBackgroundContainer(props) {
    return (
        <ImageBackground source={require('../assets/images/login_background.jpg')} style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.container}>
                <Avatar.Image size={120} style={{ alignSelf: 'center', marginTop: -80, marginBottom: 40 }}
                    source={props.avatar ? { uri: props.avatar } : require('../assets/images/splash.png')} />
                {props.children}
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 80,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: Padding.page_horizontal,
        paddingVertical: Padding.page_horizontal * 5,
        margin: Padding.page_horizontal,
        borderColor: Colors.primary_light_color,
        borderWidth: 1,
        backgroundColor: 'white',
        opacity: 0.8,
        borderRadius: 5,
    },
})