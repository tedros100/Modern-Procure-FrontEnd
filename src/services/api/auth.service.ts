import API from './handlers/base.service';
import AuthStorage from "@/services/auth-storage";
import axios from "axios";
import baseConfig from "@/services/api/handlers/base.config";

const guestConfig = {
    baseURL: process.env.VUE_APP_API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',

    },
};

const guestAPI = axios.create(guestConfig);
const AuthAPI = {
    login({username, password}: { username: string; password: string }) {
        return API.post(
            //   Made "../oauth/token' to "/oauth/token"
            '/oauth/token',
            `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&grant_type=password`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(
                        `${process.env.VUE_APP_CLIENT_ID}:${process.env.VUE_APP_CLIENT_SECRET}`,
                    )}`,
                },
            },
        );
    },
    signup(body: any) {
        return guestAPI.post('api/user/auth/signup', body);

    },

    logout() {
        return new Promise<void>((resolve, reject) => resolve());
    },

    me() {
        return API.get('api/user/currentUser')
            .then((value) => value.data).catch(err => {
                throw err;
            });
    },

    company(userId: number) {
        return API.get(`/user/${userId}/company`);
    },

    update(data: any) {
        return API.put(`api/user/currentUser`, data).then((resp) => resp.data);
    },

    sendPasswordReset({username, type}: { username: string; type: string }) {
        return API.post('/user/forgotPassword/', {username, type});
    },

    newPassword({token, newPassword}: { token: string; newPassword: string }) {
        return API.post('/user/newPassword', {token, newPassword});
    },

    resetPassword({
                      username,
                      oldPassword,
                      newPassword,
                  }: {
        username: string;
        oldPassword: string;
        newPassword: string;
    }) {
        return API.post('/user/resetPassword', {username, oldPassword, newPassword});
    },
};

export default AuthAPI;
