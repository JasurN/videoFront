import React, {Component, Fragment} from 'react';
import {withAlert} from "react-alert";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

class Alerts extends Component {
    static propTypes = {
        error: PropTypes.object.isRequired,
        message: PropTypes.object.isRequired
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {error, alert, message} = this.props;
        if (error !== prevProps.error) {
            if (error.message.name) {
                alert.error(`Name: ${error.message.name}`);
            }
            if (error.message.email) {
                alert.error(`Email: ${error.message.email}`);
            }
            if (error.message.message) {
                alert.error(`Message: ${error.message.message}`);
            }
            if (error.message.non_field_errors) {
                alert.error(error.message.non_field_errors);
            }
            if (error.message.username) {
                alert.error(error.message.username);
            }

        }
        if (message !== prevProps.message) {
            if (message.deleteLead) {
                alert.success(message.deleteLead)
            }
            if (message.addLead) {
                alert.success(message.addLead)
            }
            if (message.passwordNotMatch) {
                alert.error(message.passwordNotMatch);
            }
            if (message.fillAllFields) {
                alert.error(message.fillAllFields);
            }
            if (message.passwordChanged) {
                alert.success(message.passwordChanged);
            }
            if (message.userRegistered) {
                alert.success(message.userRegistered);
            }
            if (message.recordAdded) {
                alert.success(message.recordAdded);
            }
            if (message.recordAlreadyExists) {
                alert.error(message.recordAlreadyExists);
            }
            if (message.userNotRegistered) {
                alert.success(message.userNotRegistered);
            }
            if (message.cameraNotWork) {
                alert.error(message.cameraNotWork);
            }
        }
    }

    render() {
        return <Fragment/>
    }
}

const mapStateToProps = state => ({
    error: state.errors,
    message: state.messages
});

export default connect(mapStateToProps)(withAlert()(Alerts));