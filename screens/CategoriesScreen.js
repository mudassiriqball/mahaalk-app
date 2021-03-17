import * as React from 'react';
import { Text, ScrollView, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'
import CustomStatusBar from '../components/CustomStatusBar';
import Padding from '../constants/Padding';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors'
import CustomHeader from '../components/CustomHeader';
import translate from '../i18n/translate'

export default function CategoriesScreen(props) {
    return (
        <View style={{ flex: 1 }}>
            <CustomHeader title={translate('categories')} />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} style={{ margin: Padding.page_horizontal }}>
                <CustomStatusBar />
                {props.categories_list && props.categories_list.map((element, index) =>
                    <TouchableOpacity key={index} style={styles.view} onPress={() => props.navigation.navigate('Sub Categories', { category_id: element._id })}>
                        <Text style={styles.text}>{element.value}</Text>
                        <AntDesign name='right' style={{ alignSelf: 'center' }} size={14} color={Colors.primary_color} />
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
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