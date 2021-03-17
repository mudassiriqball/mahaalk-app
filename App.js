import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import axios from 'axios'
import MuhalikConfig from './sdk/muhalik.config'
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import Colors from './constants/Colors';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
const Stack = createStackNavigator();
import NetInfo from '@react-native-community/netinfo';
import { I18Provider, LOCALES } from './i18n'
import React, { Component } from 'react';
import { getTokenFromStorage, checkTokenExpAuth } from './sdk/authentication-service';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import AddressScreen from './screens/AddressScreen';
import ChangePictureScreen from './screens/ChangePictureScreen';
import PersonelInfoScreen from './screens/PersonelInfoScreen';
import { AsyncStorage } from 'react-native';
import 'intl';
import OrdersScreen from './screens/OrdersScreen';
import ProductsScreen from './screens/ProductsScreen';
import ShowProductScreen from './screens/ShowProductScreen';
import SubCategoriesScreen from './screens/SubCategoriesScreen';
import SearchScreen from './screens/SearchScreen';
import WishlistScreen from './screens/WishlistScreen';

import intlEN from 'react-intl/locale-data/en';
import intlAR from 'react-intl/locale-data/ar';
import { addLocaleData } from 'react-intl'
import TermsConditionsScreen from './screens/TermsConditionsScreen';
import PrivacyStatementScreen from './screens/PrivacyStatementScreen';
addLocaleData([...intlEN, ...intlAR])


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: LOCALES.ENGLISH,
      currLang: 'en',
      token: null,
      user: {
        _id: null, role: '', mobile: '', full_name: '', gender: '', countary: '', city: '', address: '',
        email: '', shop_name: '', shop_category: '', shop_address: '', avatar: '', status: ''
      },
      cart_count: 0,
      isNetwork: true,
      categories_list: [],
      sub_categories_list: [],
      home_categories_list: [],
      cart_products: [],
    }
  }

  isLoadingComplete
  unmounted = true
  CancelToken = axios.CancelToken
  source = this.CancelToken.source()

  async componentDidMount() {
    const lang = await AsyncStorage.getItem('lang')
    this.loadUser()
    if (lang == 'ar') {
      this.setState({ locale: LOCALES.ARABIC, currLang: 'ar' })
    } else if (lang == 'en') {
      this.setState({ locale: LOCALES.ENGLISH, currLang: 'en' })
    } else {
      this.setState({ locale: LOCALES.ENGLISH, currLang: 'en' })
      AsyncStorage.setItem('lang', 'en')
    }

    this.getCategories()
  }

  async loadUser() {
    const _decoded_token = await checkTokenExpAuth()
    if (_decoded_token != null) {
      this.setState({ user: _decoded_token })
      this.getUser(_decoded_token._id)
      const _token = await getTokenFromStorage()
      this.setState({ token: _token })
    }
  }

  async getUser(id) {
    const currentComponent = this
    const user_url = MuhalikConfig.PATH + `/api/users/user-by-id/${id}`;
    await axios.get(user_url).then((res) => {
      currentComponent.setState({ user: res.data.data[0], cart_count: res.data.data[0].cart.length })
      currentComponent.getCartData(res.data.data[0].cart)
    }).catch((err) => {
      console.log('get user error:', err)
    })
  }
  async getCartData(cart) {
    this.setState({ cart_products: [] })
    let copyArray = []
    const currentComponent = this

    cart && cart.forEach((element, index) => {
      getProducts(element, index)
    })

    async function getProducts(element, index) {
      const url = MuhalikConfig.PATH + `/api/products/product-by-id/${element.p_id}`;
      await axios.get(url, { cancelToken: currentComponent.source.token }).then(res => {
        if (currentComponent.unmounted) {
          let obj = {}
          obj['_id'] = element._id
          obj['p_id'] = element.p_id
          obj['variation_id'] = element.variation_id
          obj['quantity'] = element.quantity
          obj['product'] = res.data.data[0]
          obj['check'] = false
          obj['isLoading'] = false
          if (res.data.data[0].product_type != "simple-product") {
            res.data.data[0].product_variations.forEach((e, i) => {
              if (e._id == element.variation_id) {
                obj['variation'] = e
              }
            })
          }
          copyArray.push(obj)
        }
      }).catch((error) => {
        console.log('error:', error)
        if (currentComponent.unmounted) {
          alert('Error')
        }
      })
    }
    this.setState({ cart_products: copyArray })

    return () => {
      this.unmounted = false
      this.source.cancel();
    };
  }

  async getCategories() {
    const currentComponent = this
    const home_categories_url = MuhalikConfig.PATH + '/api/categories/home-categories';
    await axios.get(home_categories_url).then((res) => {
      currentComponent.setState({ home_categories_list: res.data.data })
    }).catch((err) => {
    })

    const cat_url = MuhalikConfig.PATH + '/api/categories/categories';
    await axios.get(cat_url).then((res) => {
      currentComponent.setState({
        categories_list: res.data.category.docs,
        sub_categories_list: res.data.sub_category.docs
      })

    }).catch((err) => {
    })
  }

  handleChangeLang = (lang) => {
    if (lang == 'en') {
      this.setState({ locale: LOCALES.ENGLISH, currLang: 'en' })
      AsyncStorage.setItem('lang', 'en')
    } else {
      this.setState({ locale: LOCALES.ARABIC, currLang: 'ar' })
      AsyncStorage.setItem('lang', 'ar')
    }
  }

  logout() {
    this.setState({
      user: {
        _id: null, role: '', mobile: '', full_name: '', gender: '', countary: '', city: '', address: '',
        email: '', shop_name: '', shop_category: '', shop_address: '', avatar: '', status: ''
      },
      token: null
    })
  }

  removeFromcart(obj_id, index) {
    let copyArray = []
    copyArray = Object.assign([], this.state.cart_products)
    copyArray.splice(index, 1)
    this.setState({ cart_products: copyArray, cart_count: this.state.cart_count - 1 })
  }

  render() {
    return (
      <I18Provider locale={this.state.locale}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <NavigationContainer
            linking={LinkingConfiguration}
            screenProps={{
              currLang: this.state.currLang,
              changeLang: (lang) => this.handleChangeLang(lang)
            }}
          >
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: Colors.primary_color },
                headerTintColor: Colors.primary_text_color,
                headerTitleAlign: 'center',
              }}
            >

              {/* Home , Categories, Cart , Account */}
              <Stack.Screen name="Root" options={{ headerShown: false }}>
                {props =>
                  <BottomTabNavigator {...props}
                    currLang={this.state.currLang}
                    changeLang={(lang) => this.handleChangeLang(lang)}
                    user={this.state.user}
                    logout={this.logout.bind(this)}
                    token={this.state.token}
                    locale={this.state.locale}
                    cart_count={this.state.cart_count}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    removeFromcart={this.removeFromcart.bind(this)}
                    categories_list={this.state.categories_list}
                    sub_categories_list={this.state.sub_categories_list}
                    isNetwork={this.state.isNetwork}
                    cart_products={this.state.cart_products}
                  />
                }
              </Stack.Screen>


              {/* Home Stack */}
              {/* Products Screen */}
              <Stack.Screen name="Products" options={{ headerShown: false }}>
                {props =>
                  <ProductsScreen {...props}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* Show Products Screen */}
              <Stack.Screen name="ShowProduct" options={{ headerShown: false }}>
                {props =>
                  <ShowProductScreen {...props}
                    currLang={this.state.currLang}
                    user={this.state.user}
                    cart_count={this.state.cart_count}
                    token={this.state.token}
                    reloadUser={() => this.getUser(this.state.user._id)}
                  />
                }
              </Stack.Screen>
              {/* Search Screen */}
              <Stack.Screen name="Search" options={{ headerShown: false }}>
                {props =>
                  <SearchScreen {...props}
                  />
                }
              </Stack.Screen>


              {/* Categories Stack */}
              {/* SubCategories Screen */}
              <Stack.Screen name="Sub Categories">
                {props =>
                  <SubCategoriesScreen {...props}
                    categories_list={this.state.categories_list}
                    sub_categories_list={this.state.sub_categories_list}
                  />
                }
              </Stack.Screen>


              {/* Account Stack */}
              {/* Login Screen */}
              <Stack.Screen name="Login">
                {props =>
                  <LoginScreen {...props}
                    reloadUser={this.loadUser.bind(this)}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* Reset Password Screen*/}
              <Stack.Screen name="Reset Password">
                {props => <ResetPasswordScreen {...props}
                  currLang={this.state.currLang}
                />}
              </Stack.Screen>
              {/* Signup Screen*/}
              <Stack.Screen name="Signup">
                {props =>
                  <SignupScreen {...props}
                    currLang={this.state.currLang}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>
              {/* Terms & Conditions Screen*/}
              <Stack.Screen name="Terms & Conditions">
                {props =>
                  <TermsConditionsScreen {...props}
                  />
                }
              </Stack.Screen>
              {/* PrivacyStatement Screen*/}
              <Stack.Screen name="Privacy Statement">
                {props =>
                  <PrivacyStatementScreen {...props}
                  />
                }
              </Stack.Screen>
              {/* Personel Info Screen */}
              <Stack.Screen name="Personel Info">
                {props =>
                  <PersonelInfoScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* My Address Screen */}
              <Stack.Screen name="My Address">
                {props =>
                  <AddressScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* Change Picture SCreen */}
              <Stack.Screen name="Change Picture">
                {props =>
                  <ChangePictureScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
              {/* Orders Screen*/}
              <Stack.Screen name="Orders">
                {props =>
                  <OrdersScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                  />
                }
              </Stack.Screen>
              {/* Wishlist Screen*/}
              <Stack.Screen name="My Wishlist">
                {props =>
                  <WishlistScreen {...props}
                    token={this.state.token}
                    user={this.state.user}
                    reloadUser={() => this.getUser(this.state.user._id)}
                    currLang={this.state.currLang}
                  />
                }
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </I18Provider>
    );
    // }
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.body_color,
    // marginTop: Constants.statusBarHeight,
  },
});
