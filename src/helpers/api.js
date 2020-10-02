import {tokenHeaderConfig} from "../store/actions/auth";
import {createMessage, returnErrors} from "../store/actions/messages";
import axios from 'axios';
import store from "../store/store";

export const getDepartments = async () => {
    return axios.get('api/records/departments', tokenHeaderConfig(store.getState))
        .then(res => {
            return res.data;
        })
        .catch(error => store.dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const getUserTypes = async () => {
    return axios.get('api/auth/userTypes', tokenHeaderConfig(store.getState))
        .then(res => {
            return res.data;
        })
        .catch(error => store.dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const getSubCategories = async () => {
    return axios.get('api/records/categories', tokenHeaderConfig(store.getState))
        .then(res => {
            return res.data;
        })
        .catch(error => store.dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const getRoomsList = async () => {
    return axios.get('api/records/rooms', tokenHeaderConfig(store.getState))
        .then(res => {
            return res.data;
        })
        .catch(error => store.dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const getUsersList = async () => {
    return axios.get('api/auth/users', tokenHeaderConfig(store.getState))
        .then(res => {
            return res.data.filter(userItem => (userItem.userType !== "Супер Админ"));
        })
        .catch(error => store.dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const updateUser = async ({
                                     user_id,username, first_name, last_name,
                                     password, department, userType,
                                     room, file
                                 }) => {
    debugger;
    const data = new FormData();
    if (file) {
        data.append('file', file);
    }
    if (password.length > 0) {
        data.append('password', password);
    }
    data.append('username', username);
    data.append('user_id', user_id);
    data.append('first_name', first_name);
    data.append('last_name', last_name);
    data.append('department', department);
    data.append('userType', userType);
    data.append('room', room);
    return axios.patch('/api/auth/users', data, tokenHeaderConfig(store.getState))
        .then(() => {
            store.dispatch(createMessage({userUpdated: 'Данные пользователя обновлены'}));
            return true;
        })
        .catch(error => {
            store.dispatch(createMessage({userNotUpdated: 'Что-то пошло не так при обновлении'}));
            store.dispatch(returnErrors(error.response.data,
                error.response.status));
            return false;
        })
};