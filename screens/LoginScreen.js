import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, Picker } from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import { TextInput } from "react-native-paper";
import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'
import { saveTokenToStorage } from "../sdk/authentication-service";
import translate from "../i18n/translate";
import FullWidthCustomButton from "../shared/full-width-custom-button";
import TranslateTextInput from "../i18n/translate-text-inputl";
import Colors from '../constants/Colors'
import ImageBackgroundContainer from "../components/ImageBackgroundContainer";
import MobileNumber from "../components/MobileNumber";
import PhoneRegExp from '../constants/PhoneRegix';

const FormValidationSchema = yup.object().shape({
    mobile: yup.string().required(translate('enter_mobile_nmbr')),
    password: yup.string().required(translate('enter_password'))
        .min(8, translate('password_min'))
        .max(20, translate('password_max')),
});

export default function LoginScreen(props) {
    const [showPassword, setShowPassword] = useState(false)
    const [countryCode, setCountryCode] = useState('+966')
    const [mobileError, setMobileError] = useState('')

    async function login(values, actions) {
        const phoneNumber = countryCode + values.mobile
        if (countryCode == '+966' && PhoneRegExp.ksaPhoneRegExp.test(phoneNumber) || countryCode == '+92' && PhoneRegExp.pakPhoneRegExp.test(phoneNumber)) {
            setMobileError('')
            const url = MuhalikConfig.PATH + '/api/users/login';
            let data = {}
            data = {
                mobile: phoneNumber,
                password: values.password
            }

            await axios.post(url, data).then((res) => {
                if (res.status == '200') {
                    saveTokenToStorage(res.data.token);
                    props.reloadUser()
                    props.navigation.navigate('Root', { screen: 'Home' });
                }
            }).catch((err) => {
                console.log('errrr:', err)
                try {
                    actions.setFieldError('general', err.response.data.message)
                } catch (er) {
                    actions.setFieldError('general', translate('login_failed'))
                }
            })
        } else {
            setMobileError(translate('enter_valid_mobile'))
        }
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Formik
                    initialValues={{ mobile: "", password: "" }}
                    validationSchema={FormValidationSchema}
                    onSubmit={(values, actions) => login(values, actions)
                        .then(() => {
                        })
                        .catch(error => {
                            actions.setFieldError('general', error.message);
                        })
                        .finally(() => {
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
                        isSubmitting
                    }) => {
                        return (
                            <ImageBackgroundContainer>
                                <MobileNumber
                                    value={values.mobile}
                                    onChangeText={handleChange("mobile")}
                                    onBlur={handleBlur("mobile")}
                                    countryCode={countryCode}
                                    setCountryCode={(value) => setCountryCode(value)}
                                />
                                <Text style={{ color: Colors.error_color }}>
                                    {mobileError}
                                </Text>
                                <TranslateTextInput
                                    id={'enter_password'}
                                    label={translate('password')}
                                    secureTextEntry={showPassword ? false : true}
                                    value={values.password}
                                    onChangeText={handleChange("password")}
                                    textContentType='password'
                                    onBlur={handleBlur("password")}
                                    left={<TextInput.Icon name='lock' color={Colors.primary_color} color={Colors.primary_color} />}
                                    right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} color={Colors.primary_color} color={Colors.primary_color} onPress={() => setShowPassword(!showPassword)} />}
                                />
                                <Text style={{ color: Colors.error_color }}>
                                    {touched.password && errors.password}
                                </Text>
                                <View style={styles.forgot_password}>
                                    <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Reset Password')} > {translate('forgot_password')} </Text>
                                </View>
                                {<Text style={{ color: Colors.error_color }}>{errors.general}</Text>}
                                <View style={styles.signup}>
                                    <Text>{translate('dont_have_account')}</Text>
                                    <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Signup')} > {translate('signup')} </Text>
                                </View>
                                <FullWidthCustomButton icon='login' onPress={handleSubmit} loading={isSubmitting}>
                                    {translate('login')}
                                </FullWidthCustomButton>
                            </ImageBackgroundContainer>
                        );
                    }}
                </Formik>
            </ScrollView >
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    forgot_password: {
        marginLeft: 'auto'
    },
    signup: {
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});