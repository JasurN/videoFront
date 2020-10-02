import {combineReducers} from "redux";

import errors from './errors';
import messages from "./messages";
import auth from './auth'
import records from "./records";
import recordDetails from "./recordDetails"
export default combineReducers({
    errors,
    messages,
    auth,
    records,
    recordDetails,
});