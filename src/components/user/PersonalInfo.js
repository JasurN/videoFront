import React, {Component} from 'react';
import {Card, Container} from "react-bootstrap";
import {connect} from 'react-redux';

class PersonalInfo extends Component {
    static propTypes = {};

    render() {
        const {isAuthenticated, user, user_info, user_type} = this.props.auth;
        localStorage.setItem('department', user_info.department.name);
        return (
            <div className=' mt-2'>
                {isAuthenticated ? (
                        <Container>
                            <Card style={{width: '15em'}} className="text-right">
                                <Card.Img className="profileImage" variant="top"

                                          src={user_info ? user_info.profileImage : <div/>}/>
                                <Card.Body>
                                    <Card.Title>{
                                        user ? `${user.first_name} ${user.last_name}` :
                                            <div/>}</Card.Title>
                                    <Card.Text>{user_info && user_type && user_type !== 'Супер Админ' ?
                                        user_info.department.name :
                                        <div/>}</Card.Text>
                                    <Card.Text>{user_info ? user_info.userType.name : <div/>}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Container>
                    )
                    :
                    <div/>}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, null)(PersonalInfo);
