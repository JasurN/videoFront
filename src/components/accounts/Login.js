import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {login} from "../../store/actions/auth";
import PropTypes from "prop-types";
import {makeTwoStrToLowerCaseAndConcat} from "../../helpers";

class Login extends Component {
    state = {
        firstName: '',
        lastName: '',
        password: '',
    };

    static propTypes = {
        login: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool
    };

    onSubmit = event => {
        event.preventDefault();
        const username = makeTwoStrToLowerCaseAndConcat(this.state.firstName, this.state.lastName);
        this.props.login(username, this.state.password);
        this.setState({
            password: '',
        });
    };

    onChange = event => this.setState({
        [event.target.name]: event.target.value
    });

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        const {firstName, lastName, password} = this.state;
        return (
            <div className="col-md-4 m-auto">
                <div className="card card-body mt-2">

                    <h2 className="text-center">Login into account</h2>
                    <p className="text-center"><strong>Department head hint: </strong><br/>benjon : 123123123 </p>
                    <p className="text-center"><strong>User hint: </strong><br/>tomr : 123123123</p>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Username*</label>
                            <input
                                type="text"
                                className="form-control"
                                name="firstName"
                                onChange={this.onChange}
                                value={firstName}
                            />
                        </div>

                        <div className="form-group">
                            <label>Password*</label>
                            <input
                                type="password"
                                className="form-control"
                                name="password"
                                onChange={this.onChange}
                                value={password}
                                required={true}
                            />
                        </div>
                        <div className="form-group">
                            <div className="text-center">
                                <button type="submit" className="btn btn-primary">
                                    Login
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Login);
