import * as React from 'react';
import { Modal, Portal, Text, Provider } from 'react-native-paper';
import { StyleSheet, Dimensions, View } from 'react-native'
import Colors from '../constants/Colors';

const ToastModal = (props) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <View style={{
            flex: 1,
            width: windowWidth,
            height: windowHeight,
            position: 'absolute',
            zIndex: 10,
        }}>
            <Provider>
                <Portal>
                    <Modal visible={props.show} onDismiss={props.onHide}>
                        <Text style={styles.modal}>{props.message}</Text>
                    </Modal>
                </Portal>
            </Provider>
        </View>
    );
};
const styles = StyleSheet.create({
    modal: {
        textAlignVertical: 'center',
        textAlign: 'center',
        marginHorizontal: 10,
        padding: 5,
        minHeight: 100,
        backgroundColor: Colors.primary_text_color,
        color: Colors.primary_color,
        borderRadius: 5,
    }
})
export default ToastModal;
