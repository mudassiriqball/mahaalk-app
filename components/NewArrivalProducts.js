import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, ImageBackground, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

import translate from '../i18n/translate'
import Padding from '../constants/Padding';
import ProductCard from './ProductCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH - (Padding.page_horizontal * 2);
const ITEM_WIDTH = SLIDER_WIDTH / 3;


class NewArrivalProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this._renderItem = this._renderItem.bind(this)
    }

    _renderItem({ item }) {
        return (
            <View style={{ padding: 2 }}>
                <ProductCard item={item} navigation={this.props.navigation} />
            </View>
        );
    }

    render() {
        return (
            <View>
                <View style={{ flexDirection: 'row', paddingHorizontal: 3, marginBottom: 10 }}>
                    <Text style={{ marginRight: 'auto', fontSize: 16 }}>{translate(this.props.type)}</Text>
                    <Text style={{ color: 'blue', fontSize: 13 }}
                        onPress={() => this.props.navigation.navigate('Products', { q: 'new-arrival' })}
                    >
                        {translate('show_more')}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Carousel
                        data={this.props.data}
                        renderItem={this._renderItem}
                        sliderWidth={SLIDER_WIDTH}
                        itemWidth={ITEM_WIDTH}
                        activeSlideAlignment={'start'}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={1}
                    />
                </View>
            </View >
        );
    }
}

export default NewArrivalProducts
