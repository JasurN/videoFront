import axios from 'axios';
import { createMessage, returnErrors } from "./messages";
import { tokenHeaderConfig } from "./auth";
import {
    ADD_RECORD,
    ADD_RECORD_FAIL,
    GET_RECORDS,
    RECORD_REMOVED_SUCCESSFULLY
} from "./types";
import store from "../store";

export const getRecords = () => (dispatch, getState) => {
    axios.get('/api/records/', tokenHeaderConfig(getState))
        .then(res => {
            dispatch({
                type: GET_RECORDS,
                payload: res.data
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};


export const addRecord = async (record_id, short_description) => {
    const body = JSON.stringify({
        record_id,
        short_description
    });
    return axios.post('/api/records/', body, tokenHeaderConfig(store.getState))
        .then(res => {
            store.dispatch(createMessage({ recordAdded: 'Новое дело создано' }));
            store.dispatch({
                type: ADD_RECORD,
                payload: res.data
            })
        })
        .catch(error => {
            store.dispatch(createMessage({ recordAlreadyExists: 'Дело с таким ID  уже существует' }));
            store.dispatch({
                type: ADD_RECORD_FAIL
            });
        })
};

export const removeRecord = (record_id) => (dispatch, getState) => {
    axios.put(`/api/records/${record_id}/`, tokenHeaderConfig(getState))
        .then(() => {
            dispatch({
                type: RECORD_REMOVED_SUCCESSFULLY,
                payload: record_id
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};

export const adminRemoveRecord = (record_id) => (dispatch, getState) => {
    axios.delete(`/api/records/${record_id}/`, tokenHeaderConfig(getState))
        .then(() => {
            dispatch({
                type: RECORD_REMOVED_SUCCESSFULLY,
                payload: record_id
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};