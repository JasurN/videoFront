import {
    ADD_RECORD_DETAIL,
    ADD_SELECTED_RECORD_TO_STORE, FILE_UPLOAD_SUCCESSFULLY, GET_ALL_RECORD_DETAILS,
    GET_RECORD_DETAILS,
    RECORD_DETAIL_PLAY_SUCCESSFULLY, RECORD_DETAIL_REMOVED_SUCCESSFULLY, RECORD_DETAIL_STOP_SUCCESSFULLY
} from "../actions/types"

const initialState = {
    selectedRecord: {},
    recordDetails: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_ALL_RECORD_DETAILS:
        case GET_RECORD_DETAILS:
            return {
                ...state,
                recordDetails: action.payload
            };
        case ADD_RECORD_DETAIL:
            return {
                ...state,
                recordDetails: [...state.recordDetails, action.payload]
            };
        case ADD_SELECTED_RECORD_TO_STORE:
            return {
                ...state,
                selectedRecord: action.payload
            };
        case RECORD_DETAIL_PLAY_SUCCESSFULLY:
        case FILE_UPLOAD_SUCCESSFULLY:
        case RECORD_DETAIL_STOP_SUCCESSFULLY:
            return {
                ...state,
                recordDetails: state.recordDetails.map(record_detail_item => {
                    if (record_detail_item.id === action.payload.id) {
                        record_detail_item = action.payload;
                    }
                    return record_detail_item;
                })
            };
        case RECORD_DETAIL_REMOVED_SUCCESSFULLY:
            return {
                ...state,
                recordDetails: state.recordDetails
                    .filter(record_detail_item => record_detail_item.id !== action.payload)
            };
        default:
            return state;
    }

};