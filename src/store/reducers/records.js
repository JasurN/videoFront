import {ADD_RECORD, GET_RECORDS, RECORD_REMOVED_SUCCESSFULLY} from "../actions/types";

const initialState = {
    records: []
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_RECORDS:
            return {
                ...state,
                records: action.payload
            };
        case ADD_RECORD:
            return {
                ...state,
                records: [...state.records, action.payload]
            };
        case RECORD_REMOVED_SUCCESSFULLY:
            return {
                ...state,
                records: state.records
                    .filter(record_item => record_item.id !== action.payload)
            };
        default:
            return state;
    }
}