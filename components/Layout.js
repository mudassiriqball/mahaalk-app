import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'
import { ScrollView, TouchableOpacity } from 'react-native'
import { Searchbar } from 'react-native-paper';
import Padding from '../constants/Padding';
import { FormattedMessage } from 'react-intl'
import Colors from '../constants/Colors';
import { YellowBox, StyleSheet, View, Text } from 'react-native';
YellowBox.ignoreWarnings(['VirtualizedLists should never be nested']);
import ScreenLayout from '../constants/ScreenLayout'

export default function Layout(props) {
    const [searchQuery, setSearchQuery] = useState('');

    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const [tags, setTags] = useState([])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getSuggestions = () => {
            const _url = MuhalikConfig.PATH + `/api/categories/tags`
            axios({
                method: 'GET',
                url: _url,
                cancelToken: source.token
            }).then(res => {
                if (unmounted) {
                    setTags(res.data.data)
                }
            }).catch(err => {
                if (unmounted) {
                    if (axios.isCancel(err)) return
                }
            })
        }
        getSuggestions()
        return () => {
            unmounted = false
        }
    }, []);

    function handleSetSearchValue(val) {
        setSearchQuery(val)
        if (val != '') {
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
        setSuggestions([])
        let array = []
        tags && tags.forEach((element, index) => {
            if (element.includes(val)) {
                array.push(element)
            }
        })
        setSuggestions(array)
    }

    function handleSearch(searchQuery) {
        setShowSuggestions(false)
        props.navigation.push('Search', { search: searchQuery })
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false} style={{ margin: Padding.page_horizontal }}>
            <FormattedMessage id={'search_here'}>
                {msg =>
                    <Searchbar style={{
                        marginBottom: Padding.page_horizontal,
                    }}
                        placeholder={msg}
                        onChangeText={(val) => handleSetSearchValue(val)}
                        onSubmitEditing={() => handleSearch(searchQuery)}
                        value={searchQuery}
                        iconColor={Colors.primary_color}
                        onIconPress={() => handleSearch(searchQuery)}
                    />
                }
            </FormattedMessage>
            {showSuggestions != '' &&
                <View style={styles.suggestion_view}>
                    {suggestions && suggestions.map((element, index) =>
                        <TouchableOpacity key={index} onClick={() => handleSearch(element)}>
                            <Text style={styles.suggestion_item} >{element}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            }
            {props.children}
        </ScrollView>
    )
}
const styles = StyleSheet.create({
    suggestion_view: {
        position: "absolute",
        maxHeight: ScreenLayout.window.height - 50,
        zIndex: 100,
        backgroundColor: 'white',
        width: '100%',
        top: 55,
        padding: 10,
        borderRadius: 5,
    },
    suggestion_item: {
        color: 'gray',
        fontSize: 15,
        padding: 5,
    }
});