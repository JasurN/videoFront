import {
    ADD_RECORD_DETAIL,
    ADD_RECORD_DETAIL_FAIL,
    ADD_SELECTED_RECORD_TO_STORE, GET_ALL_RECORD_DETAILS,
    GET_RECORD_DETAILS,
    RECORD_DETAIL_PLAY_SUCCESSFULLY,
    RECORD_DETAIL_REMOVED_SUCCESSFULLY,
    RECORD_DETAIL_STOP_SUCCESSFULLY
} from "./types";
import axios from 'axios';
import {tokenHeaderConfig} from "./auth";
import {createMessage, returnErrors} from "./messages";
import store from "../store";

export const addSelectedRecordToStory = (selectedRecord) => (dispatch) => {
    dispatch({
        type: ADD_SELECTED_RECORD_TO_STORE,
        payload: selectedRecord
    })
};

export const getAllRecordsDetails = () => (dispatch, getState) => {
    axios.get('/api/records/details/', tokenHeaderConfig(getState))
        .then(res => {
            dispatch({
                type: GET_ALL_RECORD_DETAILS,
                payload: res.data
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const getRecordDetails = (selected_record_id) => (dispatch, getState) => {
    axios.get(`/api/records/details/${selected_record_id}`, tokenHeaderConfig(getState))
        .then(res => {
            dispatch({
                type: GET_RECORD_DETAILS,
                payload: res.data
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const addRecordDetail = (record_id, short_description, category_id) => {
    const status_id = 1;
    const body = JSON.stringify({
        record_id,
        status_id,
        short_description,
        category_id
    });
    return axios.post('/api/records/details/', body, tokenHeaderConfig(store.getState))
        .then(res => {
            store.dispatch({
                type: ADD_RECORD_DETAIL,
                payload: res.data
            });
            store.dispatch(createMessage({recordDetailAdded: 'Подкатегория создана'}));
        })
        .catch(error => {
            store.dispatch(returnErrors(error.response.data,
                error.response.status));
            store.dispatch({
                type: ADD_RECORD_DETAIL_FAIL
            });
        })
};

export const playRecordDetail = ({
                                     selectedRecordId, login, password,
                                     room_name, port, ipAddress
                                 }) => (dispatch, getState) => {
    const body = JSON.stringify({
        login,
        password,
        room_name,
        port,
        ipAddress,
    });
    axios.post(`/api/records/details/${selectedRecordId}/play/`, body, tokenHeaderConfig(getState))
        .then(res => {
            dispatch({
                type: RECORD_DETAIL_PLAY_SUCCESSFULLY,
                payload: res.data
            })
        })
        .catch(error => {
            dispatch(
                returnErrors(error.response.data, error.response.status));
            dispatch(createMessage({cameraNotWork: 'Камера не работает'}));
        });
};

export const stopRecordDetail = (record_detail_id) => (dispatch, getState) => {
    axios.get(`/api/records/details/${record_detail_id}/stop/`, tokenHeaderConfig(getState))
        .then(res => {
            dispatch({
                type: RECORD_DETAIL_STOP_SUCCESSFULLY,
                payload: res.data
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const removeRecordDetail = (record_detail_id) => (dispatch, getState) => {
    axios.get(`/api/records/details/${record_detail_id}/remove/`, tokenHeaderConfig(getState))
        .then(() => {
            dispatch({
                type: RECORD_DETAIL_REMOVED_SUCCESSFULLY,
                payload: record_detail_id
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const deleteRecordDetail = (record_detail_id) => (dispatch, getState) => {
    axios.put(`/api/records/details/${record_detail_id}/remove/`, tokenHeaderConfig(getState))
        .then(() => {
            dispatch({
                type: RECORD_DETAIL_REMOVED_SUCCESSFULLY,
                payload: record_detail_id
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};