import axios from 'axios';
import {createMessage, returnErrors} from "./messages";
import {
    USER_LOADED, USER_LOADING,
    AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL, PASSWORD_CHANGED
} from './types';

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
    // User Loading
    dispatch({type: USER_LOADING});

    axios.get('/api/auth/user', tokenHeaderConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        })
        .catch(error => {
            dispatch(returnErrors(error.response.data,
                error.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        })
};

// LOGIN USER
export const login = (username, password) => (dispatch, getState) => {
    // Request Body
    const body = JSON.stringify({
        username,
        password
    });

    axios.post('/api/auth/login', body, tokenHeaderConfig(getState))
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        })
        .catch(error => {
            dispatch(returnErrors(error.response.data,
                error.response.status));
            dispatch({
                type: LOGIN_FAIL
            });
        })
};

// REGISTER USER
export const register = ({username, first_name, last_name,
                             password, department, userType,
                             room, file}) => (dispatch, getState) => {
    // Request Body
    const data = new FormData();
    data.append('file', file);
    data.append('username', username);
    data.append('first_name', first_name);
    data.append('last_name', last_name);
    data.append('password', password);
    data.append('department', department);
    data.append('userType', userType);
    data.append('room', room);

    axios.post('/api/auth/register', data, tokenHeaderConfig(getState))
        .then(res => {
            dispatch(createMessage({userRegistered: 'Новый пользователь создан'}));
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            })
        })
        .catch(error => {
            dispatch(createMessage({userNotRegistered: 'Что-то пошло не так при регистрации'}));
            dispatch(returnErrors(error.response.data,
                error.response.status));
            dispatch({
                type: REGISTER_FAIL
            });
        })
};

// LOGOUT USER
export const logout = () => (dispatch, getState) => {
    axios.post('/api/auth/logout/', null, tokenHeaderConfig(getState))
        .then(() => {
            dispatch({
                type: LOGOUT_SUCCESS,
            })
        })
        .catch(error => {
            dispatch(returnErrors(error.response.data,
                error.response.status));
        })
};

export const changePassword = ({username ,oldPassword, newPassword}) => (dispatch, getState) => {
    const body = JSON.stringify({
        username,
        password: oldPassword,
        new_password: newPassword
    });

    axios.put('/api/auth/user', body, tokenHeaderConfig(getState))
        .then(() => {
            dispatch(createMessage({passwordChanged: 'Пароль изменен'}));
            dispatch({
                type: PASSWORD_CHANGED
            });
        })
        .catch(error => {
            dispatch(returnErrors(error.response.data,
                error.response.status));

        })
};

// Setup config with token - helper function
export const tokenHeaderConfig = getState => {

    // Get token from state
    const token = getState().auth.token;

    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (token) {
        config.headers['Authorization'] = `Token ${token}`;
    }

    return config;
};