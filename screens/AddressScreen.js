import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Alert, ScrollView } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'
import translate from "../i18n/translate";
import FullWidthCustomButton from "../shared/full-width-custom-button";
import TranslateTextInput from "../i18n/translate-text-inputl";
import Colors from "../constants/Colors";
import ImageBackgroundContainer from "../components/ImageBackgroundContainer";
import toastAndroid from '../components/toastAndroid'

const FormValidationSchema = yup.object().shape({
    countary: yup.string(),
    city: yup.string().required(translate('enter_city'))
        .min(3, translate('city_min'))
        .max(30, translate('city_max')),
    address: yup.string().required(translate('enter_address'))
        .min(3, translate('address_min'))
        .max(100, translate('address_max')),
    shop_name: yup.string().required(translate('enter_shop_name'))
        .min(3, translate('shop_name_min'))
        .max(50, translate('shop_name_max')),
    shop_address: yup.string().required(translate('enter_shop_address'))
        .min(5, translate('min_shop_address'))
        .max(200, translate('max_shop_address')),
});

export default function AddressScreen(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [isEdit, setIsEdit] = useState(false)

    async function updateAddress(values, actions) {

        setIsLoading(true)
        let data = {}
        if (props.user.role != 'vendor') {
            data = {
                city: values.city,
                address: values.address
            }
        } else {
            data = {
                city: values.city,
                shop_name: values.shop_name,
                shop_address: values.shop_address,
            }
        }
        const url = MuhalikConfig.PATH + `/api/users/user-profile/${props.user._id}`
        axios.put(url, data, {
            headers: {
                'authorization': props.token,
            }
        }).then((res) => {
            props.reloadUser()
            setIsLoading(false)
            if (props.currLang == 'en') {
                toastAndroid(true, 'Address Updated Successfully')
            } else {
                toastAndroid(true, 'تم تحديث المعلومات الشخصية بنجاح')

            }
            setIsEdit(false)
        }).catch((err) => {
            setIsLoading(false)
            console.log('eeeee', err)
            actions.setFieldError('general', translate('error'))
        });
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Formik
                    initialValues={{
                        countary: props.user.countary,
                        city: props.user.city,
                        address: props.user.role != 'vendor' ? props.user.address : '1234567890',
                        shop_name: props.user.role == 'vendor' ? props.user.shop_name : '1234567890',
                        shop_address: props.user.role == 'vendor' ? props.user.shop_address : '1234567890',
                    }}
                    validationSchema={FormValidationSchema}
                    onSubmit={(values, actions) => updateAddress(values, actions)
                        .then(() => {
                        })
                        .catch(err => {
                            actions.setFieldError('general', err.message);
                        })
                        .finally(() => {
                            setIsLoading(false)
                            actions.setSubmitting(false);
                        })}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        errors,
                        handleBlur,
                    }) => {
                        return (
                            <ImageBackgroundContainer>
                                <TranslateTextInput
                                    id={'select_country'}
                                    label={translate('country')}
                                    value={values.countary || 'KSA'}
                                    onChangeText={handleChange("countary")}
                                    onBlur={handleBlur("countary")}
                                    disabled={true}
                                />
                                {isEdit &&
                                    <Text style={{ color: Colors.error_color }}>
                                        {''}
                                    </Text>
                                }
                                <TranslateTextInput
                                    id={'enter_city'}
                                    label={translate('city')}
                                    value={isEdit ? values.city : props.user.city}
                                    onChangeText={handleChange("city")}
                                    onBlur={handleBlur("city")}
                                    disabled={!isEdit}
                                />
                                {isEdit &&
                                    <Text style={{ color: Colors.error_color }}>
                                        {touched.city && errors.city}
                                    </Text>
                                }

                                {props.user.role != 'vendor' ?
                                    <>
                                        <TranslateTextInput
                                            id={'enter_address'}
                                            label={translate('address')}
                                            value={isEdit ? values.address : props.user.address}
                                            onChangeText={handleChange("address")}
                                            onBlur={handleBlur("address")}
                                            disabled={!isEdit}
                                        />
                                        {isEdit &&
                                            <Text style={{ color: Colors.error_color }}>
                                                {touched.address && errors.address}
                                            </Text>
                                        }
                                    </>
                                    :
                                    <>
                                        <TranslateTextInput
                                            id={'enter_shop_name'}
                                            label={translate('shop_name')}
                                            value={isEdit ? values.shop_name : props.user.shop_name}
                                            onChangeText={handleChange("shop_name")}
                                            onBlur={handleBlur("shop_name")}
                                            disabled={!isEdit}
                                        />
                                        {isEdit &&
                                            <Text style={{ color: Colors.error_color }}>
                                                {touched.address && errors.address}
                                            </Text>
                                        }

                                        <TranslateTextInput
                                            id={'enter_address'}
                                            label={translate('shop_address')}
                                            value={isEdit ? values.shop_address : props.user.shop_address}
                                            onChangeText={handleChange("shop_address")}
                                            onBlur={handleBlur("shop_address")}
                                            disabled={!isEdit}
                                        />
                                        {isEdit &&
                                            <Text style={{ color: Colors.error_color }}>
                                                {touched.shop_address && errors.shop_address}
                                            </Text>
                                        }
                                    </>
                                }
                                {isEdit ?
                                    <Text style={{ color: Colors.error_color }}>
                                        {errors.general}
                                    </Text>
                                    :
                                    <View style={{ height: 10 }} />
                                }

                                <FullWidthCustomButton icon={isEdit ? 'marker-cancel' : 'account-edit'} disabled={isLoading} onPress={() => isEdit ? setIsEdit(false) : setIsEdit(true)}>
                                    {isEdit ? translate('cancel') : translate('edit')}
                                </FullWidthCustomButton>
                                {isEdit &&
                                    <>
                                        <View style={{ height: 10 }} />
                                        <FullWidthCustomButton icon='update' onPress={handleSubmit} loading={isLoading}
                                            disabled={values.city == props.user.city && values.address == props.user.address && values.shop_name == props.user.shop_name && values.shop_address == props.user.shop_address}
                                        >
                                            {isLoading ? translate('updating') : translate('update')}
                                        </FullWidthCustomButton>
                                    </>
                                }
                            </ImageBackgroundContainer>
                        );
                    }}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
