import React, {Component} from 'react';
import {Container, Divider} from "semantic-ui-react";
import RecordAddForm from "./records/RecordAddForm";
import RecordsList from "./records/RecordsList";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import PersonalInfo from "./user/PersonalInfo";

class Main extends Component{
    static propTypes = {
        auth: PropTypes.object.isRequired,
    };

    render() {
        const {user_info} = this.props.auth;

        return (
            <div>
                 <PersonalInfo/>
                <Container>

                    {user_info ? (user_info.userType.id !== 1 && ( <RecordAddForm/>)) : <span/>}
                    <Divider/>
                    <h3>Существующие дела</h3>
                    <RecordsList/>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, )(Main);