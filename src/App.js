import React, { Component, Fragment } from 'react';

import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from "react-alert-template-basic";

import { Provider } from 'react-redux';
import store from "./store/store";

import Header from "./components/layout/Header";
import Main from "./components/Main";
import Alerts from "./components/layout/Alerts";
import Login from "./components/accounts/Login";
import Register from "./components/accounts/Register";
import PrivateRoute from "./components/common/PrivateRoute";
import { loadUser } from "./store/actions/auth";
import RecordDetail from "./components/recordDetails/RecordDetail";

import './App.css';
import ChangePassword from "./components/accounts/ChangePassword";
import AllUsersList from "./components/user/AllUsersList";
import SuperAdminRoute from "./components/common/SuperAdminRoute";
import DeleteRecordList from "./components/admin/DeleteRecordList";
import DeleteRecordDetailList from "./components/admin/DeleteRecordDetailList";
import AllDepartmentUsers from "./components/departmentHead/AllDepartmentUsers";
// ALERT OPTIONS
const alertOptions = {
    timeout: 2500,
    position: 'top center'
};

export default class App extends Component {
    componentDidMount() {
        store.dispatch(loadUser());
    }

    render() {
        return (
            <Provider store={store}>
                <AlertProvider template={AlertTemplate}
                    {...alertOptions}>
                    <Router>
                        <Fragment>
                            <Header />
                            <Alerts />
                            <Switch>
                                <Route exact path="/login" component={Login} />
                                <SuperAdminRoute exact path="/register" component={Register} />
                                <PrivateRoute exact path="/detail" component={RecordDetail} />
                                <PrivateRoute exact path="/" component={Main} />
                                <PrivateRoute exact path="/changepassword" component={ChangePassword} />
                                <PrivateRoute exact path="/allDepartmentUsers" component={AllDepartmentUsers} />
                                <SuperAdminRoute exact path="/allusers" component={AllUsersList} />
                                <SuperAdminRoute exact path="/deleteRecord" component={DeleteRecordList} />
                                <SuperAdminRoute exact path="/deleteRecordDetail" component={DeleteRecordDetailList} />
                            </Switch>
                        </Fragment>
                    </Router>
                </AlertProvider>
            </Provider>
        )
    }
}

