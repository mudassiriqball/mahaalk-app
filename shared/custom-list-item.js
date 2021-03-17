import React from 'react'
import { List } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors'

export default function CustomListItem(props) {
    return (
        <List.Item
            onPress={props.onPress}
            style={styles.list}
            titleStyle={{
                fontSize: 13, margin: 0, padding: 0, color: 'gray', marginVertical: 0,
                marginHorizontal: 0,
            }}
            title={props.title}
            left={() => <AntDesign name={props.lefticon} style={{ display: 'flex', alignItems: 'center', margin: 15 }} size={25} color={Colors.primary_color} />}
            right={() => <AntDesign name={props.righticon} style={{ alignSelf: 'center', marginRight: 15 }} size={15} color={Colors.primary_color} />}
        />
    )
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: 'white',
        paddingBottom: 0,
        paddingTop: 0,
        margin: 0,
        marginVertical: 3,
    }
});