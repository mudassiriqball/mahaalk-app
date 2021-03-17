import React, { useState, useEffect } from 'react'
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'
import Colors from '../constants/Colors'
import Padding from '../constants/Padding'
import CustomButton from '../shared/custom-button'
import ToastModal from '../components/ToastModal'
import { AntDesign } from '@expo/vector-icons';
import translate from '../i18n/translate'
import TranslateTextInput from '../i18n/translate-text-inputl'
import { Checkbox } from 'react-native-paper'
import { Image, View, Dimensions, Text, Picker, StyleSheet, ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import DiscountPrice from '../components/DiscountPrice'
import { EvilIcons } from '@expo/vector-icons';
import CustomHeader from '../components/CustomHeader'
import toastAndroid from '../components/toastAndroid'

const SCREEN_HEIGHT = Dimensions.get('window').height - 150;

export default function Cart(props) {
  const [isProcedeOrder, setIsProcedeOrder] = useState(false)

  const [products, setProducts] = useState(props.cart_products)

  const [checkAll, setCheckAll] = useState(false)
  const [sub_total, setSubTotal] = useState(0)
  const [shipping_charges, setShipping_charges] = useState(0)

  useEffect(() => {
    setProducts(props.cart_products)
    let unmounted = true
    async function getData() {
      if (props.user.role != 'customer') {
        setProducts([])
        return
      } else {
        if (unmounted) {
          if (props.user.city == 'riyadh' || props.user.city == 'Riyadh' || props.user.city == 'الرياض' || props.user.city == 'رياض') {
            setShipping_charges(25)
          } else {
            setShipping_charges(45)
          }
        }
      }
    }
    getData()
    return () => {
      unmounted = false
    };
  }, [props]);

  useEffect(() => {
    calculateSubTotalPrice()
  }, [products, props])

  function calculateSubTotalPrice() {
    setSubTotal(0)
    let sum = 0
    products.forEach(element => {
      if (element.product.product_type == "simple-product") {
        let count = element.product.product_price - element.product.product_discount / 100 * element.product.product_price
        let rounded = Math.floor(count);
        let decimal = count - rounded;
        if (decimal > 0) {
          sum += rounded + 1 * element.quantity
        } else {
          sum += rounded * element.quantity
        }
      } else {
        let count = element.variation.price - element.variation.discount / 100 * element.variation.price
        let rounded = Math.floor(count);
        let decimal = count - rounded;
        if (decimal > 0) {
          sum += rounded + 1 * element.quantity
        } else {
          sum += rounded * element.quantity
        }
      }
    })
    setSubTotal(sum)
  }

  function getCartCont(length) {
    let options = []
    for (let i = 0; i < length; i++) {
      options.push(
        <Picker.Item key={i} label={(i + 1) + ''} value={i + 1} />
      )
    }
    return options
  }

  function handleSetQuantity(quan, index) {
    let copyArray = []
    copyArray = Object.assign([], products)
    copyArray[index].quantity = quan
    setProducts(copyArray)
  }

  function handleAllCheck(e) {
    let copyArray = []
    copyArray = Object.assign([], products)
    if (checkAll == false) {
      products.forEach((element, index) => {
        copyArray[index].check = true
      })
      setCheckAll(true)
    } else {
      products.forEach((element, index) => {
        copyArray[index].check = false
      })
      setCheckAll(false)
    }
    setProducts(copyArray)
  }

  function handleCheck(index) {
    let copyArray = []
    copyArray = Object.assign([], products)
    copyArray[index].check = !copyArray[index].check
    setProducts(copyArray)

    if (copyArray[index].check == false) {
      setCheckAll(false)
    }
  }

  function handleAllDeleteClick() {
    products.forEach((element, index) => {
      if (element.check) {
        handleDeleteCart(element._id, index)
      }
    })
  }

  async function handleDeleteCart(obj_id, index) {
    let copyArray = []
    copyArray = Object.assign([], products)
    copyArray[index].isLoading = true
    setProducts(copyArray)
    const _url = MuhalikConfig.PATH + `/api/users/clear-cart-data-by-id/${props.user._id}`;
    await axios({
      method: 'PUT',
      url: _url,
      params: { obj_id: obj_id },
      headers: {
        'authorization': props.token
      }
    }).then(res => {
      props.removeFromcart(obj_id, index)
    }).catch(err => {
      let copyArray = []
      copyArray = Object.assign([], products)
      copyArray[index].isLoading = false
      setProducts(copyArray)
      alert('Error')
      console.log('error:', err)
    })
  }

  async function handleProcedeOrder() {
    setIsProcedeOrder(true)
  }

  async function handleClearCart() {
    const _url = MuhalikConfig.PATH + `/api/users/clear-cart/${props.user._id}`;
    await axios({
      method: 'DELETE',
      url: _url,
      headers: {
        'authorization': props.token
      }
    }).then(res => {
      setProducts([])
      props.reloadUser()
    }).catch(err => {
      alert('Error')
    })
  }

  function handlePlaceOrderError(element) {
    if (props.currLang == 'en') {
      toastAndroid(true, 'Product quantity out of stock, change stock and try again')
    } else {
      toastAndroid(true, 'كمية المنتج غير متوفرة , قم بتغيير المخزون وحاول مرة أخرى')
    }
    let copyArray = Object.assign([], products)
    let obj = {}
    obj = copyArray[element[0].index]
    obj['err'] = true
    copyArray[element.index] = obj;
    setProducts(copyArray)
  }

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader title={translate('cart')} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} style={{ margin: Padding.page_horizontal }}>
        {props.token == null ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <EvilIcons name="cart" size={200} color='gray' />
            <Text style={{ color: 'gray', marginBottom: 10 }}>{translate('sinin_to_view_cart')}</Text>
            <CustomButton onPress={() => props.navigation.navigate('Login')}>{translate('signin')}</CustomButton>
          </View>
          :
          isProcedeOrder ?
            <ProcedeOrder
              products={products}
              cancel={() => setIsProcedeOrder(false)}
              shipping_charges={shipping_charges}
              sub_total={sub_total}
              clearCart={handleClearCart}
              handlePlaceOrderError={handlePlaceOrderError}
              {...props}
            />
            :
            products == '' ?
              <View style={{ flex: 1, minHeight: SCREEN_HEIGHT, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                <CustomButton onPress={() => props.navigation.navigate('Root', { screen: 'Home' })}> {translate('continue_shopping')}</CustomButton>
              </View>
              :
              <View>
                <View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 5, padding: Padding.page_horizontal, marginBottom: 10 }}>
                      <Checkbox color={Colors.primary_color} status={checkAll ? 'checked' : 'unchecked'} onPress={(e) => handleAllCheck(e)} />
                      <Text style={{ marginRight: 'auto' }}>{translate('select_all')}</Text>
                      <TouchableOpacity onPress={handleAllDeleteClick} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <AntDesign name="delete" size={24} color={Colors.error_color} />
                        <Text style={{ color: Colors.error_color, marginLeft: 5 }}>{translate('delete')}</Text>
                      </TouchableOpacity>
                    </View>

                    {products && products.map((element, index) =>
                      <View key={index} style={{
                        borderColor: element.err ? Colors.error_color : null, borderWidth: element.err ? 1 : null,
                        backgroundColor: 'white', borderRadius: 5, padding: Padding.page_horizontal, marginBottom: 5
                      }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Checkbox status={element.check ? 'checked' : 'unchecked'} color={Colors.primary_color} onPress={() => handleCheck(index)} />
                          <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                              onPress={() => props.navigation.navigate('ShowProduct', { _id: element.product._id, sub_category: element.product.sub_category.value, vendor_id: element.product.vendor_id })}>
                              <Text style={{ color: 'blue', marginRight: 20 }}>{translate('view')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDeleteCart(element._id, index)}>
                              <Text style={{ color: Colors.error_color }}>{element.isLoading ? translate('deleting') : translate('delete')}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                        {element.product.product_type == "simple-product" ?
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: '30%', paddingVertical: 5, paddingRight: 4 }}>
                              <Image
                                style={{ maxHeight: 100, minHeight: 100, borderRadius: 5, overflow: "hidden" }}
                                source={element.product.product_image_link[0] ? { uri: element.product.product_image_link[0].url } : ''}
                                defaultSource={require('../assets/images/logo.jpg')}
                              />
                            </View>
                            <View style={{ flexDirection: 'column', width: '70%', paddingVertical: 5, paddingLeft: 4 }}>
                              <Text numberOfLines={2}>{element.product.product_name}</Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <DiscountPrice price={element.product.product_price} discount={element.product.product_discount} />
                              </View>
                              <Picker
                                selectedValue={element.quantity}
                                style={styles.picker}
                                onValueChange={(itemValue, itemIndex) => handleSetQuantity(itemValue, index)}
                              >
                                <Picker.Item label={element.quantity + ''} value={element.quantity} />
                                {getCartCont(element.product.product_in_stock).map(element =>
                                  element
                                )}
                              </Picker>
                            </View>
                          </View>
                          :
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: '30%', paddingVertical: 5, paddingRight: 4 }}>
                              <Image
                                style={{ maxHeight: 100, minHeight: 100, borderRadius: 5, overflow: "hidden" }}
                                source={element.variation.image_link[0] ? { uri: element.variation.image_link[0].url } : ''}
                                defaultSource={require('../assets/images/logo.jpg')}
                              />
                            </View>
                            <View style={{ flexDirection: 'column', width: '70%', paddingVertical: 5, paddingLeft: 4 }}>
                              <Text numberOfLines={2}>{element.product.product_name}</Text>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <DiscountPrice price={element.variation.price} discount={element.variation.discount} />
                              </View>
                              <Picker
                                selectedValue={element.quantity}
                                style={styles.picker}
                                onValueChange={(itemValue, itemIndex) => handleSetQuantity(itemValue, index)}
                              >
                                <Picker.Item label={element.quantity + ''} value={element.quantity} />
                                {getCartCont(element.variation.stock).map(element =>
                                  element
                                )}
                              </Picker>
                            </View>
                          </View>
                        }
                      </View>
                    )}
                  </View>
                </View>
                <View style={{ backgroundColor: 'white', borderRadius: 5, padding: Padding.page_horizontal, marginBottom: 10 }}>
                  <Text style={{ color: 'gray', display: 'flex', justifyContent: 'center', fontSize: 18, marginBottom: 20 }}>{translate('order_summary')}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'gray', marginRight: 'auto' }}>{translate('sub_total')}</Text>
                    <Text style={{ color: 'gray' }}>{translate('rs')}{sub_total}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: 'gray', borderBottomWidth: 1, paddingBottom: 10 }}>
                    <Text style={{ color: 'gray', marginRight: 'auto' }}>{translate('shipping_charges')}</Text>
                    <Text style={{ color: 'gray' }}>{translate('rs')}{shipping_charges}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: 'orange', marginRight: 'auto', marginVertical: 20, fontSize: 16 }}>{translate('total')}</Text>
                    <Text style={{ color: 'orange', fontSize: 16 }}>{translate('rs')}{sub_total + shipping_charges}</Text>
                  </View>
                  <CustomButton icon='page-next-outline' onPress={handleProcedeOrder} disabled={products == ''}> {translate('procede_order')} </CustomButton>
                </View>
              </View>
        }
      </ScrollView>
    </View>
  )
}

function ProcedeOrder(props) {
  const [loading, setLoading] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)

  const [name, setName] = useState(props.user.full_name)
  const [city, setCity] = useState(props.user.city)
  const [mobile, setMobile] = useState(props.user.mobile)
  const [address, setAddress] = useState(props.user.address)

  const [nameError, setNameError] = useState('')
  const [cityError, setCityError] = useState('')
  const [mobError, setMobError] = useState('')
  const [addressError, setAddressError] = useState('')

  const [shipping_charges, setShipping_charges] = useState(props.shipping_charges)

  async function confirmOrder() {
    if (name == '' || city == '' || mobile == '' || address == '') {
      if (name == '') {
        setNameError(translate('enter_value'))
      }
      if (city == '') {
        setCityError(translate('enter_value'))
      }
      if (mobile == '') {
        setMobError(translate('enter_value'))
      }
      if (address == '') {
        setAddressError(translate('enter_value'))
      }
    } else {
      setLoading(true)
      let data = []
      props.products.forEach((element, index) => {
        if (element.product.product_type == "simple-product") {
          let pp = 0
          let unmounted = true
          let count = element.product.product_price - element.product.product_discount / 100 * element.product.product_price
          let rounded = Math.floor(count);
          let decimal = count - rounded;
          if (decimal > 0 && unmounted) {
            pp = rounded + 1;
          } else if (unmounted) {
            pp = rounded
          }
          data.push({
            'vendor_id': element.product.vendor_id,
            'p_id': element.p_id,
            'quantity': element.quantity,
            'price': pp
          })
        } else {
          let pp = 0
          let unmounted = true
          let count = element.variation.price - element.variation.discount / 100 * element.variation.price
          let rounded = Math.floor(count);
          let decimal = count - rounded;
          if (decimal > 0 && unmounted) {
            pp = rounded + 1;
          } else if (unmounted) {
            pp = rounded
          }

          data.push({
            'vendor_id': element.product.vendor_id,
            'p_id': element.p_id,
            'variation_id': element.variation_id,
            'quantity': element.quantity,
            'price': pp
          })
        }
      })

      const url = MuhalikConfig.PATH + `/api/orders/place-order/${props.user._id}`;
      await axios.post(url,
        {
          c_name: name,
          city: city,
          mobile: mobile,
          address: address,
          sub_total: props.sub_total,
          shipping_charges: shipping_charges,
          products: data,
        },
        {
          headers: {
            'authorization': props.token
          }
        }).then((res) => {
          setLoading(false)
          if (res.data.code == 200) {
            if (props.currLang == 'en') {
              toastAndroid(true, 'Your order placed successfully')
            } else {
              toastAndroid(true, 'تم وضع طلبك بنجاح')
            }
            props.clearCart()
          } else if (res.data.code == 201) {
            props.cancel()
            props.handlePlaceOrderError(res.data.data)
          }
        }).catch((error) => {
        })
    }
  }

  function handleSetCity(city) {
    setCityError('')
    if (city == 'Riyadh' || city == 'riyadh' || city == 'رياض' || city == 'الرياض') {
      setCity(city)
      setShipping_charges(25)
    } else {
      setCity(city)
      setShipping_charges(45)
    }
  }

  return (
    <View style={{ marginVertica: 30 }}>
      {showAlertModal &&
        <ToastModal
          onHide={(e) => setShowAlertModal(false)}
          show={showAlertModal}
          header={'Success'}
          message={translate('order_placed')}
        />
      }
      <View style={{ backgroundColor: 'white', borderRadius: 5, padding: Padding.page_horizontal, marginBottom: 10 }}>
        <TranslateTextInput
          id='enter_full_name'
          label={translate('full_name')}
          value={name}
          onChangeText={(e) => { setName(e), setNameError('') }}
        />
        <Text style={{ color: Colors.error_color }}> {nameError} </Text>
        <TranslateTextInput
          id='enter_city'
          label={translate('city')}
          value={city}
          onChangeText={(e) => handleSetCity(e)}
        />
        <Text style={{ color: Colors.error_color }}> {cityError} </Text>
        <TranslateTextInput
          id='my_mobile_number'
          type='number'
          label={translate('mobile_number')}
          value={mobile}
          onChangeText={(e) => { setMobile(e), setMobError('') }}
        />
        <Text style={{ color: Colors.error_color }}> {mobError} </Text>
        <TranslateTextInput
          id='enter_address'
          label={translate('address')}
          value={address}
          onChangeText={(e) => { setAddress(e), setAddressError('') }}
        />
        <Text style={{ color: Colors.error_color }}> {addressError} </Text>
      </View>
      <View>
        <View style={{ backgroundColor: 'white', borderRadius: 5, padding: Padding.page_horizontal, marginBottom: 10 }}>
          <Text style={{ color: 'gray', display: 'flex', justifyContent: 'center', fontSize: 18, marginBottom: 20 }}>{translate('order_summary')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'gray', marginRight: 'auto' }}>{translate('sub_total')}</Text>
            <Text style={{ color: 'gray' }}>{translate('rs')}{props.sub_total}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: 'gray', borderBottomWidth: 1, paddingBottom: 10 }}>
            <Text style={{ color: 'gray', marginRight: 'auto' }}>{translate('shipping_charges')}</Text>
            <Text style={{ color: 'gray' }}>{translate('rs')}{shipping_charges}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: 'orange', marginRight: 'auto', marginVertical: 10, fontSize: 16 }}>{translate('total')}</Text>
            <Text style={{ color: 'orange', fontSize: 16 }}>{translate('rs')}{props.sub_total + shipping_charges}</Text>
          </View>
        </View>
        <View style={{ marginVertical: 10 }}>
          <Text style={{ color: 'gray', fontSize: 15 }}>{translate('payment_method')}</Text>
          <View style={styles.payment_view}>
            <Text style={{ color: 'gray' }}>{translate('on_delivery')}</Text>
            <Checkbox
              status='checked'
              color={Colors.primary_color}
            />
            <View style={{ marginRight: 'auto' }} />
            <Text style={{ color: 'gray' }}>{translate('online_payment')}</Text>
            <Checkbox
              status='unchecked'
              disabled={true}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 15 }}>
          <CustomButton icon='keyboard-return' onPress={props.cancel} >{translate('cancel')}</CustomButton>
          <View style={{ marginRight: 'auto' }} />
          <CustomButton icon='check' onPress={confirmOrder} loading={loading}>
            {loading ? translate('placing_order') : translate('confirm_order')}
          </CustomButton>
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  picker_view: {
    flex: 1,
    alignItems: "center",
  },
  picker: {
    marginVertical: '2%',
    padding: 5,
    borderColor: 'white'
  },
  payment_view: {
    flexDirection: "row",
    alignItems: 'center'
  }
})