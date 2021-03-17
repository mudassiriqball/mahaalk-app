import * as React from 'react';
import { Button, Text, View, ScrollView, StyleSheet } from 'react-native';
import CustomStatusBar from '../components/CustomStatusBar';
import Padding from '../constants/Padding';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SubCategoriesScreen(props) {
    const { category_id } = props.route.params;

    return (
        <ScrollView contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false} style={{ margin: Padding.page_horizontal }}>
            <CustomStatusBar />
            {props.sub_categories_list && props.sub_categories_list.map((element, index) =>
                element.category_id == category_id &&
                <TouchableOpacity key={index} style={styles.view} onPress={() => props.navigation.navigate('Products', { field: 'sub-category', q: element.value })}>
                    <Text style={styles.text}>{element.value}</Text>
                    <AntDesign name='right' style={{ alignSelf: 'center' }} size={14} color={Colors.primary_color} />
                </TouchableOpacity>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    view: {
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 3,
        alignItems: 'center'
    },
    text: {
        fontSize: 15,
        marginRight: 'auto'
    }
})