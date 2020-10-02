import axios from 'axios';
import {tokenHeaderConfig} from "./auth";
import store from "../store";
import {returnErrors} from "./messages";
import {FILE_UPLOAD_SUCCESSFULLY} from "./types";

export const uploadRecordDetailFileToServer =
    (selectedFile, record_detail_id) => (dispatch, getState) => {
        const data = new FormData();
        data.append('file', selectedFile);
        data.append('record_detail', record_detail_id);

        axios.post("/api/records/file/", data, tokenHeaderConfig(getState), { // receive two parameter endpoint url ,form data
        })
            .then(res => { // then print response status
                dispatch({
                    type: FILE_UPLOAD_SUCCESSFULLY,
                    payload: res.data
                })
            })
            .catch(error => {
                store.dispatch(returnErrors(error.response.data,
                    error.response.status));
            })
    };