
// export default AuthenticationService;
// import * as jwtDecode from 'jwt-decode';
var jwtDecode = require('jwt-decode');
import { AsyncStorage } from 'react-native';

const AuthenticationService = () => (
    <div></div>
)

export async function saveTokenToStorage(_token) {
    try {
        await AsyncStorage.setItem('token', _token)
    } catch (err) {
        console.log('save token error:', err)
    }
}

export async function getTokenFromStorage() {
    try {
        const _token = await AsyncStorage.getItem('token')
        return _token
    } catch (err) {
        console.log('get token error:', err)
        return null
    }
}

export async function removeTokenFromStorage() {
    try {
        await AsyncStorage.removeItem('token')
        return true
    } catch (err) {
        return false
    }
}


export async function checkTokenExpAuth() {
    try {
        const _token = await AsyncStorage.getItem('token')
        if (_token != null) {
            const decodedToken = jwtDecode(_token);
            if (decodedToken.exp < Date.now() / 1000) {
                await AsyncStorage.removeItem('token')
                return null
            } else {
                return decodedToken.data;
            }
        } else {
            return null;
        }
    } catch (err) {
        console.log('checkTokenExpAuth error:', err)
        return null
    }
}

// export function checkAuth(current_role) {
//     const token = localStorage.getItem('token')
//     if (token == null) {
//         if (current_role == '/login' || current_role == '/signup' || current_role == '/vendor-signup') {
//             Router.replace(current_role)
//         } else
//             Router.replace('/')
//     } else {
//         const decodedToken = jwtDecode(token);
//         if (decodedToken.exp < Date.now() / 1000) {
//             localStorage.removeItem('token')
//             Router.push('/')
//         } else if (decodedToken.data.role == current_role) {
//             return decodedToken.data;
//         } else if (current_role == '/vendor-signup' && decodedToken.data.role == 'customer') {
//             Router.replace(current_role)
//         } else {
//             Router.replace('/')
//         }
//     }
// }

export default AuthenticationService;