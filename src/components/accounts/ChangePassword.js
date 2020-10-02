import React, {Component} from 'react';
import {Redirect} from "react-router-dom";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {createMessage} from "../../store/actions/messages";
import {changePassword} from "../../store/actions/auth";

class ChangePassword extends Component {
    state = {
        oldPassword: '',
        newPassword: '',
        reNewPassword: '',
    };

    static propTypes = {
        auth: PropTypes.object.isRequired,
        isAuthenticated: PropTypes.bool,
        changePassword: PropTypes.func.isRequired
    };

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/"/>
        }
        const {oldPassword, newPassword, reNewPassword} = this.state;
        return (
            <div className="col-md-6 m-auto">
                <div className="card card-body mt-2">
                    <h2 className="text-center">Поменять пароль</h2>
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label>Введите Старый Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                name="oldPassword"
                                onChange={this.onChange}
                                value={oldPassword}
                                required={true}
                            />
                        </div>
                        <div className="form-group">
                            <label>Введите Новый Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                name="newPassword"
                                onChange={this.onChange}
                                value={newPassword}
                                required={true}
                                minLength={8}
                            />
                        </div>
                        <div className="form-group">
                            <label>Повторите Новый Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                name="reNewPassword"
                                onChange={this.onChange}
                                value={reNewPassword}
                                required={true}
                                minLength={8}
                                placeholder="это чтобы потвердить что вы ввели новый пароль правильно"
                            />
                        </div>
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-success btn-lg rounded-lg">
                                Поменять Пароль
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    onChange = event => this.setState({
        [event.target.name]: event.target.value
    });
    onSubmit = event => {
        event.preventDefault();
        const {oldPassword, newPassword, reNewPassword} = this.state;
        if (newPassword !== reNewPassword) {
            this.props.createMessage({passwordNotMatch: "Новые Пароли не совпадают"})
        } else {
            const username = this.props.auth.user.username;
            const passwords = {username, oldPassword, newPassword};
            this.props.changePassword(passwords)
        }
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    auth: state.auth
});
export default connect(mapStateToProps, {createMessage, changePassword})(ChangePassword);