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
    mobile: yup.string(),
    full_name: yup.string().required(translate('enter_full_name'))
        .min(5, translate('min_full_name'))
        .max(25, translate('max_full_name')),
    email: yup.string().email(),
});

export default function LoginScreen(props) {
    const [isEdit, setIsEdit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    async function updatePersonelInfo(data, actions) {
        setIsLoading(true)
        const url = MuhalikConfig.PATH + `/api/users/user-profile/${props.user._id}`
        axios.put(url, data, {
            headers: {
                'authorization': props.token,
            }
        }).then((res) => {
            props.reloadUser()
            setIsEdit(false)
            setIsLoading(false)
            if (props.currLang == 'en') {
                toastAndroid(true, 'Personel Info Updated Successfully')
            } else {
                toastAndroid(true, 'تم تحديث المعلومات الشخصية بنجاح')
            }
        }).catch((err) => {
            console.log('eeeee', err)
            actions.setFieldError('general', translate('error'))
        });
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Formik
                    initialValues={{ mobile: props.user.mobile, full_name: props.user.full_name, email: props.user.email }}
                    validationSchema={FormValidationSchema}
                    onSubmit={(values, actions) => updatePersonelInfo(values, actions)
                        .then(() => {
                        })
                        .catch(err => {
                            actions.setFieldError('general', err.message);
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
                                <TranslateTextInput
                                    id={'enter_mobile_nmbr'}
                                    label={translate('mobile_number')}
                                    type='number'
                                    value={values.mobile}
                                    onChangeText={handleChange("mobile")}
                                    onBlur={handleBlur("mobile")}
                                    disabled={true}
                                />
                                {isEdit &&
                                    <Text style={{ color: Colors.error_color }}>
                                        {''}
                                    </Text>
                                }
                                <TranslateTextInput
                                    id={'enter_full_name'}
                                    label={translate('full_name')}
                                    value={isEdit ? values.full_name : props.user.full_name}
                                    onChangeText={handleChange("full_name")}
                                    onBlur={handleBlur("full_name")}
                                    disabled={!isEdit}
                                />
                                {isEdit &&
                                    <Text style={{ color: Colors.error_color }}>
                                        {touched.full_name && errors.full_name}
                                    </Text>
                                }
                                <TranslateTextInput
                                    id={'enter_email'}
                                    label={translate('email')}
                                    value={isEdit ? values.email : props.user.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    disabled={!isEdit}
                                />
                                {isEdit &&
                                    <Text style={{ color: Colors.error_color }}>
                                        {touched.email && errors.email}
                                    </Text>
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
                                            disabled={values.full_name == props.user.full_name && values.email == props.user.email}>
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
const styles = StyleSheet.create({
});