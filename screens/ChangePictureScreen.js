// import * as React from 'react';
// import { View, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import Constants from 'expo-constants';
// import * as Permissions from 'expo-permissions';
// import axios from 'axios';
// import FullWidthCustomButton from '../shared/full-width-custom-button';
// import Padding from '../constants/Padding';
// import translate from '../i18n/translate';
// import MuhalikConfig from '../sdk/muhalik.config';
// import CustomButton from '../shared/custom-button';
// import ImageBackgroundContainer from '../components/ImageBackgroundContainer';
// import toastAndroid from '../components/toastAndroid'

// export default class ChangePictureScreen extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             file: null,
//             image: null,
//             isLoading: false,
//         }
//     }

//     async handleImgUpload() {
//         this.setState({ isLoading: true })
//         let currentComponent = this

//         const formData = new FormData()
//         formData.append('myImage', this.state.file)

//         const url = MuhalikConfig.PATH + `/api/users/user-avatar/${this.props.user._id}`
//         axios.put(url, formData, {
//             headers: {
//                 'content-type': 'multipart/form-data',
//                 'authorization': currentComponent.props.token,
//             }
//         }).then((res) => {
//             currentComponent.setState({ isLoading: false, image: null, file: null })
//             if (props.currLang == 'en') {
//                 toastAndroid(true, 'Profile Picture Updated Successfully')
//             } else {
//                 toastAndroid(true, 'تم تحديث صورة الملف الشخصي بنجاح')
//             }
//             currentComponent.props.reloadUser()
//         }).catch((err) => {
//             currentComponent.setState({ isLoading: false })
//             console.log('errr:', err)
//             alert('Error')
//         });
//     }

//     render() {
//         return (
//             <KeyboardAvoidingView style={{ flex: 1 }}>
//                 <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                     <ImageBackgroundContainer avatar={this.state.image ? this.state.image : this.props.user.avatar}>
//                         <CustomButton onPress={this._takePhoto} icon='camera'>
//                             {translate('take_phote')}
//                         </CustomButton>
//                         <View style={{ height: 10 }}>
//                         </View>
//                         <CustomButton onPress={this._pickImage} icon='image'>
//                             {translate('chose_image')}
//                         </CustomButton>

//                         <View style={{ height: 15 }}>
//                         </View>
//                         <FullWidthCustomButton icon='upload' onPress={this.handleImgUpload.bind(this)} loading={this.state.isLoading} disabled={!this.state.image}>
//                             {this.state.isLoading ? translate('uploading') : translate('upload')}
//                         </FullWidthCustomButton>
//                     </ImageBackgroundContainer>
//                 </ScrollView>
//             </KeyboardAvoidingView>
//         );
//     }

//     componentDidMount() {
//         this.getPermissionAsync();
//     }

//     getPermissionAsync = async () => {
//         if (Constants.platform.ios) {
//             const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
//             if (status !== 'granted') {
//                 alert('Sorry, we need camera roll permissions to make this work!');
//             }
//         }
//     };

//     _pickImage = async () => {
//         try {
//             let result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: 'Images',
//                 allowsEditing: true,
//                 aspect: [4, 3],
//                 quality: 1,
//                 base64: true
//             });
//             if (!result.cancelled) {
//                 const imagePath = result.uri;
//                 const imageExt = result.uri.split('.').pop();
//                 let picture = await fetch(imagePath);
//                 picture = await picture.blob();
//                 const imageData = new File([picture], `photo.${imageExt}`);
//                 this.setState({ image: result.uri, file: imageData })
//             }
//             console.log('file:', imageData);
//         } catch (E) {
//             console.log('image picker eror', E);
//         }
//     };
//     _takePhoto = async () => {
//         const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);
//         const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

//         // only if user allows permission to camera AND camera roll
//         if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
//             let result = await ImagePicker.launchCameraAsync({
//                 allowsEditing: true,
//                 aspect: [4, 3],
//                 mediaTypes: 'Images',
//                 quality: 1,
//                 base64: true
//             });
//             if (!result.cancelled) {
//                 const imagePath = result.uri;
//                 const imageExt = result.uri.split('.').pop();
//                 let picture = await fetch(imagePath);
//                 picture = await picture.blob();
//                 const imageData = new File([picture], `photo.${imageExt}`);
//                 this.setState({ image: result.uri, file: imageData })
//             }
//         }
//     };
// }

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: 'white',
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: Padding.page_horizontal,
//         margin: Padding.page_horizontal,
//     }
// })

import * as React from 'react';
import { Button, Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import axios from 'axios';
import FullWidthCustomButton from '../shared/full-width-custom-button';
import Padding from '../constants/Padding';
import { Avatar } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import translate from '../i18n/translate';
import MuhalikConfig from '../sdk/muhalik.config';
import CustomButton from '../shared/custom-button';


export default class ChangePictureScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            image: null,
            isLoading: false,
        }
    }

    async handleImgUpload() {
        this.setState({ isLoading: true })

        let currentComponent = this

        const formData = new FormData()
        formData.append('myImage', this.state.file)

        const url = MuhalikConfig.PATH + `/api/users/user-avatar/${this.props.user._id}`
        axios.put(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'authorization': currentComponent.props.token,
            }
        }).then((res) => {
            currentComponent.setState({ isLoading: false, image: null, file: null })
            currentComponent.props.reloadUser()
        }).catch((err) => {
            currentComponent.setState({ isLoading: false })
            console.log('errr:', err)
            // alert('Error')
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ height: 20 }}>
                </View>

                {this.state.image ?
                    <Avatar.Image size={100} source={{ uri: this.state.image }} />
                    :
                    this.props.user.avatar ?
                        <Avatar.Image size={100} source={{ uri: this.props.user.avatar }} />
                        :
                        <FontAwesome5 name="user-circle" size={100} color={Colors.primary_color} />
                }

                <View style={{ height: 20 }}>
                </View>
                <CustomButton onPress={this._takePhoto} icon='camera'>
                    {translate('take_phote')}
                </CustomButton>
                <View style={{ height: 15 }}>
                </View>
                <CustomButton onPress={this._pickImage} icon='image'>
                    {translate('chose_image')}
                </CustomButton>

                <View style={{ height: 20 }}>
                </View>
                <FullWidthCustomButton onPress={this.handleImgUpload.bind(this)} loading={this.state.isLoading} disabled={!this.state.image}>
                    {this.state.isLoading ? translate('uploading') : translate('upload')}
                </FullWidthCustomButton>
                <View style={{ height: 20 }}>
                </View>

            </View>
        );
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
    };

    _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                // mediaTypes: ImagePicker.MediaTypeOptions.All,
                mediaTypes: 'Images',
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                base64: true
            });
            if (!result.cancelled) {
                // this.setState({ image: result });
                const imagePath = result.uri;
                const imageExt = result.uri.split('.').pop();
                let picture = await fetch(imagePath);
                picture = await picture.blob();
                const imageData = new File([picture], `photo.${imageExt}`);
                this.setState({ image: result.uri, file: imageData })
            }

            console.log(result);
        } catch (E) {
            console.log(E);
        }
    };
    _takePhoto = async () => {
        const { status: cameraPerm } = await Permissions.askAsync(Permissions.CAMERA);

        const { status: cameraRollPerm } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        // only if user allows permission to camera AND camera roll
        if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
            let result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4, 3],
                mediaTypes: 'Images',
                quality: 1,
                base64: true
            });
            if (!result.cancelled) {
                const imagePath = result.uri;
                const imageExt = result.uri.split('.').pop();
                let picture = await fetch(imagePath);
                picture = await picture.blob();
                const imageData = new File([picture], `photo.${imageExt}`);
                this.setState({ image: result.uri, file: imageData })


            }
        }
    };
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Padding.page_horizontal,
        margin: Padding.page_horizontal,
    }
})