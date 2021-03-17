import React, { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, Platform, KeyboardAvoidingView, Picker, ScrollView } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import firebaseConfigration from '../sdk/firebaseConfigration'
import toastAndroid from '../components/toastAndroid'
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
import ImageBackgroundContainer from "../components/ImageBackgroundContainer";
import { removeTokenFromStorage } from "../sdk/authentication-service";
import MobileNumber from "../components/MobileNumber";
import PhoneRegExp from '../constants/PhoneRegix'


try {
    firebase.initializeApp(firebaseConfigration);
} catch (err) {
}

const schema = yup.object({
    mobile: yup.string().required(translate('enter_mobile_nmbr')),
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
});

export default function ResetPasswordScreen(props) {
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
    const [user_id, setUser_id] = useState(null)
    const [countryCode, setCountryCode] = useState('+966')
    const [isNext, setIsNext] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSenVerificationCode(mobileNumber) {
        const phoneNumber = countryCode + mobileNumber
        if (countryCode == '+966' && PhoneRegExp.ksaPhoneRegExp.test(phoneNumber) || countryCode == '+92' && PhoneRegExp.pakPhoneRegExp.test(phoneNumber)) {
            setMobileError('')
            setSendCodeLoading(true)
            const url = MuhalikConfig.PATH + `/api/users/check-mobile/${phoneNumber}`;
            await axios.get(url).then((response) => {
                rechaptaVerifier(phoneNumber)
                setUser_id(response.data.data._id)
            }).catch((error) => {
                setMobileError(translate('number_not_exists'))
                setFeedback('')
                setIsCodeSended(false)
                setSendCodeLoading(false)
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
            setMobileError(translate('code_not_sended'))
            setFeedback('')
            setIsResendCode(false)
            setSendCodeLoading(false)
            setIsCodeVerified(false)
            console.log('send code error:', err)
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

    async function resetPassword(data, actions) {
        setIsLoading(true)
        const url = MuhalikConfig.PATH + `/api/users/reset-password/${user_id}`;
        if (isCodeVerified && isCodeSended) {
            await axios.put(url, data).then((res) => {
                removeTokenFromStorage()
                setIsLoading(false)
                if (props.currLang == 'en') {
                    toastAndroid(true, 'Password updated successfully')
                } else {
                    toastAndroid(true, 'تم تحديث كلمة السر بنجاح')
                }
                props.navigation.navigate('Login')
            }).catch((error) => {
                setIsLoading(false)
                console.log('error password reset:', error)
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
                        mobile: '', password: '', confirm_password: ''
                    }}
                    validationSchema={schema}
                    onSubmit={(values, actions) => resetPassword(values, actions)
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
                    }) => {
                        return (
                            <ImageBackgroundContainer>
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
                                        <View style={{ flexDirection: 'row', width: '100%' }}>
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

                                        <Text style={{ color: Colors.error_color }}>
                                            {errors.general}
                                        </Text>
                                        <FullWidthCustomButton icon='keyboard-return' onPress={() => setIsNext(false)}>
                                            {translate('back')}
                                        </FullWidthCustomButton>
                                        <View style={{ height: 10 }} />
                                        <FullWidthCustomButton icon='arrow-right' onPress={handleSubmit} disabled={isLoading || !isCodeVerified} loading={isLoading}>
                                            {translate('continue')}
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


