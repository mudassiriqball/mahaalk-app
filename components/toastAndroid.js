import { StyleSheet, ToastAndroid } from "react-native";

export default function toastAndroid(visible, message) {
    if (visible) {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50
        );
        return null;
    } else {
        return null;
    }
};