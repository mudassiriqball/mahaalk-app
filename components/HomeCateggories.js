import React, { Component, useState } from 'react';
import { Text, View, Dimensions, StyleSheet, Image, FlatList } from 'react-native';

import translate from '../i18n/translate'
import Colors from '../constants/Colors'
import Padding from '../constants/Padding';
import ProductCard from './ProductCard';
import useQueryInfiniteScroll from '../hooks/useQueryInfiniteScroll';
import Loading from './Loading';
import NoDataFound from './NoDataFound';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH - (Padding.page_horizontal * 2) - 8;
const ITEM_HEIGHT = SLIDER_WIDTH / 2.5;

export default function HomeCateggories(props) {

    const { loading, error, products, pages, total, hasMore } = useQueryInfiniteScroll('category', props.element.value, '1', '6')

    function renderItem({ item }) {
        return (
            <View style={{ padding: 2, width: '33.33333%' }}>
                <ProductCard item={item} navigation={props.navigation} layout='small' />
            </View>
        )
    }

    return (
        <View>
            <LinearGradient colors={[Colors.primary_color, Colors.body_color]} style={styles.container}>
                <View style={{ flexDirection: 'row', margin: 5, paddingBottom: 5 }}>
                    <Text style={{ marginRight: 'auto', color: Colors.primary_text_color, fontSize: 16 }}>{props.element.value}</Text>
                    <Text style={{ fontSize: 13, color: Colors.primary_text_color }}
                        onPress={() => props.navigation.navigate('Products', { field: 'category', q: props.element.value })}
                    >
                        {translate('show_more')}
                    </Text>
                </View>
                <View style={{ padding: 2, marginBottom: 5 }}>
                    <Image
                        style={{ height: ITEM_HEIGHT, width: '100%' }}
                        source={{ uri: props.element.url }}
                        defaultSource={require('../assets/images/background.jpg')}
                    />
                </View>
                {total > 0 ?
                    <FlatList
                        data={products}
                        renderItem={renderItem}
                        keyExtractor={item => item._id}
                        numColumns={3}
                        initialNumToRender={3}
                    />
                    :
                    hasMore ?
                        <Loading />
                        :
                        <NoDataFound />
                }
            </LinearGradient>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        padding: 2,
        marginBottom: 20,
    },
    image_background: {
        width: '100%',
        height: 100,
    }
})