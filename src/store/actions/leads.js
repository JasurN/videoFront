import axios from 'axios';
import {createMessage, returnErrors} from "./messages";
import {tokenHeaderConfig} from "./auth";
import {GET_LEADS, DELETE_LEAD, ADD_LEAD} from "./types";

// GET LEADS
export const getLeads = () => (dispatch, getState) => {
    axios.get('/api/leads/', tokenHeaderConfig(getState))
        .then(res => {
            dispatch({
                type: GET_LEADS,
                payload: res.data
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};

// DELETE LEADS
export const deleteLeads = (id) => (dispatch, getState) => {
    axios.delete(`/api/leads/${id}/`, tokenHeaderConfig(getState))
        .then(() => {
            dispatch(createMessage({deleteLead: 'Lead Deleted'}));
            dispatch({
                type: DELETE_LEAD,
                payload: id
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};

// ADD LEAD
export const addLead = lead => (dispatch, getState) => {
    axios.post('/api/leads/', lead, tokenHeaderConfig(getState))
        .then(res => {
            dispatch(createMessage({addLead: 'Lead Added'}));
            dispatch({
                type: ADD_LEAD,
                payload: res.data
            })
        })
        .catch(error => dispatch(
            returnErrors(error.response.data, error.response.status)));
};