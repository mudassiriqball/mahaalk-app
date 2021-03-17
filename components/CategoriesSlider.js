import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Button, TouchableRipple } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json

import translate from '../i18n/translate'
import Colors from '../constants/Colors'
import Padding from '../constants/Padding';

class CategoriesSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        }
    }

    render() {
        return (
            <ScrollView horizontal={true} style={styles.container}>
                {this.props.data.map((element, index) =>
                    <Text style={styles.text} key={index} numberOfLines={1}
                        onPress={() => this.props.navigation.navigate('Products', { field: 'category', q: element.value })}
                    >{element.value}</Text>
                )}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        overflow: 'scroll',
        backgroundColor: 'transparent',
        paddingVertical: 10,
    },

    text: {
        marginRight: 8,
        paddingVertical: 7,
        paddingHorizontal: 12,
        fontSize: 13,
        backgroundColor: Colors.primary_color,
        color: Colors.primary_text_color,
        borderRadius: 60,
        textAlign: 'center',
        alignSelf: 'center',
        display: 'flex',
        overflow: 'visible'
    },
});

export default CategoriesSlider
