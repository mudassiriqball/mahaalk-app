import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, ImageBackground } from 'react-native';
import { Button } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

import translate from '../i18n/translate'
import Colors from '../constants/Colors'
import Padding from '../constants/Padding';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SLIDER_WIDTH = SCREEN_WIDTH - (Padding.page_horizontal * 2);
const ITEM_WIDTH = SLIDER_WIDTH;
const ITEM_HEIGHT = SLIDER_WIDTH / 2.5;


const DATA = [];
for (let i = 0; i < 10; i++) {
    DATA.push(i)
}

class Carosuel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
        this._renderItem = this._renderItem.bind(this)
    }

    _renderItem({ item }) {
        return (
            <ImageBackground source={{ uri: item.url }} defaultSource={require('../assets/images/logo.jpg')} style={styles.backgroud_image}>
                <View style={{ height: 50 }}></View>
                <Text style={{ color: 'white', backgroundColor: Colors.primary_color, padding: 5, margin: 5, borderRadius: 5, opacity: 0.7 }}>{item.sub_category}</Text>
                <Button mode="contained" uppercase={false} style={{ backgroundColor: Colors.primary_color, paddingHorizontal: 5 }}>
                    {translate('shop_now')}
                </Button>
            </ImageBackground>
        );
    }

    render() {
        return (
            <View>
                <Carousel
                    data={this.props.data}
                    renderItem={this._renderItem}
                    sliderWidth={SLIDER_WIDTH}
                    itemWidth={ITEM_WIDTH}
                    slideStyle={{ paddingHorizontal: Padding.page_horizontal, alignItems: 'center', justifyContent: 'center' }}
                    // inactiveSlideOpacity={1}
                    // inactiveSlideScale={1}
                    enableSnap={true}
                    loop={true}
                    autoplay={true}
                    autoplayDelay={1000}
                    autoplayInterval={5000}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({

    backgroud_image: {
        minWidth: ITEM_WIDTH,
        maxWidth: ITEM_WIDTH,
        minHeight: ITEM_HEIGHT,
        maxHeight: ITEM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        // flex: 1,
    },
    itemLabel: {
        color: 'white',
        fontSize: 24
    },
    counter: {
        marginTop: 25,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center'
    }
});

export default Carosuel
