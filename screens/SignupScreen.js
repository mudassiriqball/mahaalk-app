import React, { useState, useRef } from "react";
import { Text, View, StyleSheet, Platform, KeyboardAvoidingView, Picker, ScrollView } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import firebaseConfigration from '../sdk/firebaseConfigration'

import axios from 'axios'
import MuhalikConfig from '../sdk/muhalik.config'

import translate from '../i18n/translate';
import TranslateTextInput from '../i18n/translate-text-inputl'
import Colors from '../constants/Colors'

import { Formik } from "formik";
import * as yup from "yup";
import { TextInput } from "react-native-paper";
import FullWidthCustomButton from "../shared/full-width-custom-button";
import translateAlert from "../i18n/translateAlert";
import ToastModal from '../components/ToastModal'
import { useEffect } from "react";
import ImageBackgroundContainer from "../components/ImageBackgroundContainer";
import MobileNumber from "../components/MobileNumber";
import PhoneRegExp from '../constants/PhoneRegix'

try {
    firebase.initializeApp(firebaseConfigration);
} catch (err) {
}

const schema = yup.object({
    mobile: yup.string().required(translate('enter_mobile_nmbr')),

    full_name: yup.string().required(translate('enter_full_name'))
        .min(5, translate('min_full_name'))
        .max(25, translate('max_full_name')),

    email: yup.string().email(translate('enter_valid_email'))
        .max(100, translate('email_max')),

    password: yup.string().required(translate('enter_password'))
        .min(8, translate('password_min'))
        .max(20, translate('password_max')),

    confirm_password: yup.string().required(translate('enter_confirm_password')).when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            translate('password_match')
        )
    }),

    countary: yup.string().required(translate('select_country')),
    city: yup.string().required(translate('enter_city'))
        .min(3, translate('city_min'))
        .max(30, translate('city_max')),

    gender: yup.string().required(translate('enter_gender')),

    address: yup.string().required(translate('enter_address'))
        .min(3, translate('address_min'))
        .max(100, translate('address_max')),

    role: yup.string(),
});

export default function SignupScreen(props) {
    const recaptchaVerifier = useRef(null);
    const [verificationId, setVerificationId] = useState();
    const [verificationCode, setVerificationCode] = useState();
    const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
    const [showPassword, setShowPassword] = useState(false)
    const [mobileError, setMobileError] = useState('')
    const [verificationCodeError, setVerificationCodeError] = useState('')
    const [feedback, setFeedback] = useState('')
    const [isCodeSended, setIsCodeSended] = useState(false)
    const [isCodeVerified, setIsCodeVerified] = useState(false)
    const [sendCodeLoading, setSendCodeLoading] = useState(false)
    const [verifyCodeLoading, setVerifyCodeLoading] = useState(false)
    const [intervalTime, setIntervalTime] = useState(60)
    const [isResendCode, setIsResendCode] = useState(false)
    const [countryCode, setCountryCode] = useState('+966')
    const [isNext, setIsNext] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [showToastModal, setShowToastModal] = useState(false)

    useEffect(() => {
        if (props.user.full_name != '') {
            props.navigation.navigate('Root', { screen: 'Home' })
        }
        return () => {
        }
    }, [])

    async function handleSenVerificationCode(mobileNumber) {
        const phoneNumber = countryCode + mobileNumber
        if (countryCode == '+966' && PhoneRegExp.ksaPhoneRegExp.test(phoneNumber) || countryCode == '+92' && PhoneRegExp.pakPhoneRegExp.test(phoneNumber)) {
            setMobileError('')
            setSendCodeLoading(true)
            const url = MuhalikConfig.PATH + `/api/users/check-mobile/${phoneNumber}`;
            await axios.get(url).then((response) => {
                setMobileError(translate('number_already_exists'))
                setFeedback('')
                setIsCodeSended(false)
                setSendCodeLoading(false)
            }).catch((error) => {
                rechaptaVerifier(phoneNumber)
            })
        } else {
            setIsCodeSended(false)
            setMobileError(translate('enter_valid_mobile'))
            setFeedback('')
            setIsCodeVerified(false)
        }
    }

    async function rechaptaVerifier(mobileNumber) {
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                mobileNumber,
                recaptchaVerifier.current
            );
            setVerificationId(verificationId)
            setIsCodeSended(true)
            setMobileError('')
            setFeedback(translate('code_sended'))
            setSendCodeLoading(false)
            let time = 60
            let interval = setInterval(() => {
                time = time - 1
                setIntervalTime(time)
                if (time == 0) {
                    setIsResendCode(true)
                    clearInterval(interval)
                }
            }, 1000);
        } catch (err) {
            console.log('error:', err)
            setIsCodeSended(true)
            setIsCodeVerified(true)
            setMobileError('')
            setSendCodeLoading(false)
            setFeedback(translate('number_verified'))
            setVerificationCodeError('')
            setIsResendCode(false)
        }
    }

    async function handleVerifyVarificationCode() {
        setVerifyCodeLoading(true)
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
            );
            await firebase.auth().signInWithCredential(credential);
            setVerifyCodeLoading(false)
            setIsCodeVerified(true)
            setFeedback(translate('number_verified'))
            setVerificationCodeError('')
            setIsResendCode(false)
        } catch (err) {
            console.log('code varification error: ', err)
            setVerifyCodeLoading(false)
            setFeedback('')
            setVerificationCodeError(translate('invalid_code'))
        }
    }

    async function userRegister(values) {
        let data = values
        data.mobile = countryCode + values.mobile

        setIsLoading(true)
        const url = MuhalikConfig.PATH + '/api/users/register';
        if (isCodeVerified && isCodeSended) {
            await axios.post(url, data).then((res) => {
                setIsLoading(false)
            }).catch((error) => {
                setIsLoading(false)
                console.log('error signup:', error)
                try {
                    actions.setFieldError('general', error.response.data.message)
                } catch (er) {
                    alert('Error')
                    actions.setFieldError('general', 'Error')
                }
            })
        } else {
            translateAlert('verify_number_first')
        }
    }


    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Formik
                    initialValues={{
                        mobile: '', full_name: '', email: '', password: '', confirm_password: '',
                        countary: 'KSA', city: '', role: 'customer', address: '', gender: ''
                    }}
                    validationSchema={schema}
                    onSubmit={(values, actions) => userRegister(values, actions)
                        .then(() => {
                            setShowToastModal(true)
                            props.navigation.navigate('Login')
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
                        setFieldValue,
                        handleBlur,
                    }) => {
                        return (
                            <ImageBackgroundContainer>
                                {showToastModal &&
                                    <ToastModal
                                        show={showToastModal}
                                        onHide={() => setShowToastModal(false)}
                                        message={translate('signup_successfull')}
                                    />
                                }
                                {!isNext ?
                                    <>
                                        <FirebaseRecaptchaVerifierModal
                                            ref={recaptchaVerifier}
                                            firebaseConfig={firebaseConfig}
                                        />
                                        <MobileNumber
                                            value={values.mobile}
                                            onChangeText={handleChange("mobile")}
                                            onBlur={handleBlur("mobile")}
                                            countryCode={countryCode}
                                            disabled={isCodeSended}
                                            setCountryCode={(value) => setCountryCode(value)}
                                        />
                                        {!isCodeSended && <Text style={{ color: Colors.error_color }}>
                                            {mobileError}
                                        </Text>}

                                        <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 5 }}>
                                            {isCodeSended && <>
                                                <Text style={{ color: 'green', marginRight: 'auto' }}>
                                                    {feedback}
                                                </Text>
                                                <Text style={{ color: 'blue', marginLeft: 'auto', marginBottom: 7 }}
                                                    onPress={() => {
                                                        setIsCodeSended(false)
                                                        setIsCodeVerified(false)
                                                        setFeedback('')
                                                        setMobileError('')
                                                        setVerificationCodeError('')
                                                    }}
                                                >
                                                    {translate('change_nmbr')}
                                                </Text>
                                            </>
                                            }
                                        </View>

                                        {!isCodeVerified && <FullWidthCustomButton icon='send' onPress={() => handleSenVerificationCode(values.mobile)} loading={sendCodeLoading}
                                            disabled={isCodeVerified ? true : isCodeSended ? isResendCode ? false : true : false || sendCodeLoading}>
                                            {isCodeSended ? translate('resend') : translate('send_code')}
                                            {!isCodeVerified && isCodeSended && !isResendCode ? '  00 : ' + intervalTime : null}
                                        </FullWidthCustomButton>}

                                        {isCodeSended && <>
                                            <TranslateTextInput
                                                id='verification_code'
                                                label={translate('verification_code')}
                                                value={verificationCode}
                                                onChangeText={setVerificationCode}
                                                keyboardType="phone-pad"
                                                disabled={!isCodeSended || isCodeVerified}
                                                left={<TextInput.Icon name='key' color={Colors.primary_color} color={Colors.primary_color} onPress={() => setShowPassword(!showPassword)} />}
                                            />
                                            <Text style={{ color: Colors.error_color }}>
                                                {verificationCodeError}
                                            </Text>
                                            <FullWidthCustomButton icon={isCodeVerified && 'check'} onPress={handleVerifyVarificationCode} loading={verifyCodeLoading} disabled={!verificationCode || isCodeVerified}>
                                                {isCodeVerified ? translate('verified') : translate('verify')}
                                            </FullWidthCustomButton>
                                        </>
                                        }
                                        {isCodeVerified && <>
                                            <View style={{ height: 10 }} />
                                            <FullWidthCustomButton icon='page-next-outline' onPress={() => setIsNext(true)}>
                                                {translate('next')}
                                            </FullWidthCustomButton>
                                        </>
                                        }
                                    </>
                                    :
                                    <>
                                        <TranslateTextInput
                                            id='enter_full_name'
                                            label={translate('full_name')}
                                            value={values.full_name}
                                            onChangeText={handleChange("full_name")}
                                            onBlur={handleBlur("full_name")}
                                        />
                                        <Text style={{ color: Colors.error_color }}>
                                            {touched.full_name && errors.full_name}
                                        </Text>
                                        <View style={{ height: 5 }}></View>

                                        <View style={styles.picker_view}>
                                            <Picker
                                                selectedValue={values.gender}
                                                style={styles.picker}
                                                onValueChange={(itemValue, itemIndex) => setFieldValue('gender', itemValue)}
                                            >
                                                <Picker.Item label={props.currLang == 'en' ? 'Select' : 'اختر'} value={props.currLang == 'en' ? 'Select' : 'اختر'} />
                                                <Picker.Item label={props.currLang == 'en' ? 'Male' : 'ذكر'} value={props.currLang == 'en' ? 'Male' : 'ذكر'} />
                                                <Picker.Item label={props.currLang == 'en' ? 'Female' : 'انثى'} value={props.currLang == 'en' ? 'Female' : 'انثى'} />
                                                <Picker.Item label={props.currLang == 'en' ? 'Other' : 'اخرى'} value={props.currLang == 'en' ? 'Other' : 'اخرى'} />
                                            </Picker>
                                        </View>
                                        <Text style={{ color: Colors.error_color }}>
                                            {touched.gender && errors.gender}
                                        </Text>
                                        <View style={styles.picker_view}>
                                            <Picker
                                                selectedValue={values.countary}
                                                style={styles.picker}
                                                onValueChange={(itemValue, itemIndex) => handleChange('countary')}
                                            >
                                                <Picker.Item label={props.currLang == 'en' ? 'KSA' : 'المملكة العربية السعودية'} value={props.currLang == 'en' ? 'KSA' : 'المملكة العربية السعودية'} />
                                            </Picker>
                                        </View>

                                        <TranslateTextInput
                                            id='enter_city'
                                            label={translate('city')}
                                            value={values.city}
                                            onChangeText={handleChange("city")}
                                            onBlur={handleBlur("city")}
                                        />
                                        <Text style={{ color: Colors.error_color }}>
                                            {touched.city && errors.city}
                                        </Text>
                                        <View style={{ height: 5 }}></View>

                                        <TranslateTextInput
                                            id='enter_address'
                                            label={translate('address')}
                                            value={values.address}
                                            onChangeText={handleChange("address")}
                                            onBlur={handleBlur("address")}
                                        />
                                        <Text style={{ color: Colors.error_color }}>
                                            {touched.address && errors.address}
                                        </Text>
                                        <View style={{ height: 5 }}></View>

                                        <TranslateTextInput
                                            id='email_place_holder'
                                            label={translate('email')}
                                            value={values.email}
                                            onChangeText={handleChange("email")}
                                            onBlur={handleBlur("email")}
                                            keyboardType='email-address'
                                            textContentType='emailAddress'
                                        />
                                        <Text style={{ color: Colors.error_color }}>
                                            {touched.email && errors.email}
                                        </Text>
                                        <View style={{ height: 5 }}></View>

                                        <TranslateTextInput
                                            id='enter_password'
                                            label={translate('password')}
                                            secureTextEntry={showPassword ? false : true}
                                            value={values.password}
                                            onChangeText={handleChange("password")}
                                            onBlur={handleBlur("password")}
                                            textContentType='password'
                                            right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} color={Colors.primary_color} color={Colors.primary_color} onPress={() => setShowPassword(!showPassword)} />}
                                        />
                                        <Text style={{ color: Colors.error_color }}>
                                            {touched.password && errors.password}
                                        </Text>
                                        <View style={{ height: 5 }}></View>

                                        <TranslateTextInput
                                            id='reenter_password'
                                            label={translate('confirm_password')}
                                            secureTextEntry={showPassword ? false : true}
                                            value={values.confirm_password}
                                            onChangeText={handleChange("confirm_password")}
                                            onBlur={handleBlur("confirm_password")}
                                            textContentType='password'
                                            right={<TextInput.Icon name={showPassword ? 'eye-off' : 'eye'} color={Colors.primary_color} onPress={() => setShowPassword(!showPassword)} />}
                                        />
                                        <Text style={{ color: Colors.error_color }}>
                                            {touched.confirm_password && errors.confirm_password}
                                        </Text>
                                        <View style={{ height: 5 }}></View>

                                        <View style={{ textAlign: 'center', marginVertical: 5 }}>
                                            <Text >
                                                {translate('by_creating_account')}
                                            </Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Terms & Conditions')} > {translate('terms_conditions')} </Text>
                                                <Text> {translate('and')} </Text>
                                                <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Privacy Statement')} > {translate('privacy_statement')} </Text>
                                            </View>
                                        </View>
                                        <View style={{ textAlign: 'center', flexDirection: 'row', marginTop: 5, margin: 10 }}>
                                            <Text >
                                                {translate('already_have_account')}
                                            </Text>
                                            <Text style={{ color: 'blue' }} onPress={() => props.navigation.navigate('Login')} > {translate('login')} </Text>
                                        </View>

                                        <View>
                                            <Text style={{ color: Colors.error_color }}>
                                                {errors.general}
                                            </Text>
                                        </View>
                                        <FullWidthCustomButton icon='keyboard-return' onPress={() => setIsNext(false)}>
                                            {translate('back')}
                                        </FullWidthCustomButton>
                                        <View style={{ height: 10 }} />
                                        <FullWidthCustomButton icon='account-plus-outline' onPress={handleSubmit} disabled={isLoading || !isCodeVerified} loading={isLoading}>
                                            {isLoading ? translate('signing') : translate('signup')}
                                        </FullWidthCustomButton>
                                    </>
                                }
                            </ImageBackgroundContainer>
                        )
                    }}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    picker_view: {
        width: '100%',
        alignItems: "center",
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
    },
    picker: {
        width: '100%',
        marginTop: 2.5,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary_color,
        height: 50,
        borderColor: Colors.primary_text_color,
        backgroundColor: Colors.primary_text_color,
    },
})