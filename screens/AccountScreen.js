import { StyleSheet, Text, SafeAreaView, View, Picker } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Colors from '../constants/Colors';
import CustomListItem from '../shared/custom-list-item';
import { List, Button, Avatar } from 'react-native-paper';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import translate from '../i18n/translate';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { removeTokenFromStorage } from '../sdk/authentication-service';
import Padding from '../constants/Padding';
import * as Linking from 'expo-linking';

export default function AccountScreen(props) {
    const [showLanguageStack, setShowLanguageStack] = useState(false)

    async function logout() {
        if (removeTokenFromStorage()) {
            props.logout()
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.backImgContainer}>
                    {props.user.full_name == '' ?
                        <>
                            <View style={styles.img_login_button_div}>
                                <Button loading={false} icon='login' onPress={() => props.navigation.navigate('Login')} style={{ backgroundColor: Colors.primary_text_color }}>
                                    {translate('login')}
                                </Button>
                            </View>
                            <View style={styles.signup}>
                                <Text style={{ color: Colors.primary_text_color }}>{translate('dont_have_account')}</Text>
                                <Text style={{ color: Colors.primary_text_color, fontSize: 18 }} onPress={() => props.navigation.navigate('Signup')} > {translate('signup')} </Text>
                            </View>
                        </>
                        :
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                            <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {props.user.avatar ?
                                    <Avatar.Image size={80} source={{ uri: props.user.avatar }} />
                                    :
                                    <FontAwesome5 name="user-circle" size={80} color={Colors.primary_text_color} />
                                }
                            </View>
                            <View style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, color: Colors.primary_text_color, fontWeight: 'bold' }}>{props.user.full_name}</Text>
                                <Text style={{ fontSize: 13, color: Colors.primary_text_color, fontWeight: 'bold' }}>{props.user.mobile}</Text>
                                <Text style={{ color: Colors.primary_text_color, position: 'absolute', right: 20, bottom: 20 }} onPress={() => props.navigation.navigate('Personel Info')} > {translate('view')} </Text>
                            </View>
                        </View>
                    }
                </View>
                <View style={styles.body_container}>
                    {props.user.full_name != '' && <>
                        <View style={{ marginBottom: '3%' }}>
                            <CustomListItem title={translate('address_without_asteric')} onPress={() => props.navigation.navigate('My Address')} lefticon="home" righticon='right' />
                            <CustomListItem title={translate('change_picture')} onPress={() => props.navigation.navigate('Change Picture')} lefticon="picture" righticon='right' />
                            <CustomListItem title={translate('change_password')} onPress={() => props.navigation.navigate('Reset Password')} lefticon="lock1" righticon='right' />
                        </View>
                        {props.user.role == 'customer' && <>
                            <View style={{ marginBottom: '3%' }}>
                                <CustomListItem title={translate('my_wishlist')} onPress={() => props.navigation.navigate('My Wishlist')} lefticon="hearto" righticon='right' />
                            </View>
                            <View style={{ marginBottom: '3%' }}>
                                <CustomListItem title={translate('pending_orders')} onPress={() => props.navigation.navigate('Orders', { status: 'pending' })} lefticon="clockcircleo" righticon='right' />
                                <CustomListItem title={translate('delivered_orders')} onPress={() => props.navigation.navigate('Orders', { status: 'delivered' })} lefticon="checksquareo" righticon='right' />
                                <CustomListItem title={translate('cancelled_orders')} onPress={() => props.navigation.navigate('Orders', { status: 'cancelled' })} lefticon="close" righticon='right' />
                                <CustomListItem title={translate('returned_orders')} onPress={() => props.navigation.navigate('Orders', { status: 'returned' })} lefticon="closesquareo" righticon='right' />
                            </View>
                        </>
                        }
                    </>
                    }
                    <View>
                        <List.Item
                            onPress={() => setShowLanguageStack(!showLanguageStack)}
                            style={styles.list}
                            titleStyle={{
                                fontSize: 13, margin: 0, padding: 0, color: 'gray', marginVertical: 0,
                                marginHorizontal: 0,
                            }}
                            title={translate('change_language')}
                            left={() => <FontAwesome name="language" style={{ display: 'flex', alignItems: 'center', margin: 15 }} size={25} color={Colors.primary_color} />}
                            right={() => <AntDesign name={showLanguageStack ? 'up' : 'down'} style={{ alignSelf: 'center', marginRight: 15 }} size={15} color={Colors.primary_color} />}
                        />
                        {showLanguageStack &&
                            <View style={styles.picker_view}>
                                <Picker
                                    selectedValue={props.currLang}
                                    style={styles.picker}
                                    onValueChange={(itemValue, itemIndex) => { props.changeLang(itemValue), setShowLanguageStack(false) }}
                                >
                                    <Picker.Item label="English" value="en" />
                                    <Picker.Item label="العربية" value="ar" />
                                </Picker>
                            </View>
                        }
                        <List.Item
                            onPress={() => Linking.openURL('https://mahaalk.com/vendor-signup')}
                            style={styles.list}
                            titleStyle={{
                                fontSize: 13, margin: 0, padding: 0, color: 'gray', marginVertical: 0,
                                marginHorizontal: 0,
                            }}
                            title={translate('sell_on_mahaalk')}
                            left={() => <FontAwesome name="money" style={{ display: 'flex', alignItems: 'center', margin: 15 }} size={25} color={Colors.primary_color} />}
                            right={() => <AntDesign name={'right'} style={{ alignSelf: 'center', marginRight: 15 }} size={15} color={Colors.primary_color} />}
                        />
                    </View>
                    {props.user.full_name != '' && <>
                        <View style={{ marginVertical: '3%' }}>
                            <CustomListItem title={translate('logout')} onPress={logout} lefticon="logout" righticon='right' />
                        </View>
                    </>}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    body_container: {
        flex: 1,
        marginHorizontal: Padding.page_horizontal,
    },
    backImgContainer: {
        height: 130,
        backgroundColor: Colors.primary_color,
        marginBottom: 10,
        borderBottomLeftRadius: 50,
        overflow: 'hidden'
    },
    img_login_button_div: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    signup: {
        marginTop: -15,
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    list: {
        backgroundColor: 'white',
        paddingBottom: 0,
        paddingTop: 0,
        margin: 0,
        marginVertical: 3,
    },
    picker_view: {
        flex: 1,
        alignItems: "center",
    },
    picker: {
        height: 50,
        width: '90%',
        marginVertical: '2%',
        borderColor: 'white'
    },
});