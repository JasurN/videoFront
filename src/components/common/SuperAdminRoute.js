import React from 'react';
import {connect} from 'react-redux';
import {Route, Redirect} from "react-router-dom";

const SuperAdminRoute = ({component: Component, auth, ...rest}) => (
    <Route
        {...rest}
        render={props => {
            if (auth.isLoading) {
                return <h2>Loading...</h2>
            } else if (!auth.isAuthenticated) {
                return <Redirect to="/login"/>
            } else if(auth.user_type === "Супер Админ") {
                return <Component {...props}/>
            } else {
                return <Redirect to="/"/>
            }
        }}
    />
);

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(SuperAdminRoute);