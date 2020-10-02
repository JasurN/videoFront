import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../store/actions/auth";

class Header extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        logout: PropTypes.func
    };

    render() {
        const { isAuthenticated, user, user_info } = this.props.auth;
        const authLinks = (
            <ul className="navbar-nav ml-auto mt-1 mt-lg-0">
                {user_info ? (user_info.userType.id === 1 && (
                    <>
                        <li className="nav-item">
                            <Link to="/allusers" className="nav-link mr-3">Список следователей</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/deleteRecord" className="nav-link mr-3">Дела для удаления</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/deleteRecordDetail" className="nav-link mr-3">Файлы для удаления</Link>
                        </li>
                    </>
                )) : <span />

                }
                {user_info ? (user_info.userType.id === 2 && (
                    <li className="nav-item">
                        <Link to="/allDepartmentUsers" className="nav-link mr-3">Список следователей</Link>
                    </li>)) : <span />
                }
                <li className="nav-item">
                    <Link to="/changepassword" className="nav-link mr-3">Поменять пароль</Link>
                </li>
                {user_info ? (user_info.userType.id === 1 && (
                    <li className="nav-item">
                        <Link to="/register" className="nav-link mr-3">Зарегистрировать следователя</Link>
                    </li>)) : <span />
                }
                <span className="navbar-text mr-2">
                    <strong>{user ? `Вы вошли как: ${user.first_name} ${user.last_name}` : ""}</strong>
                </span>

                <li className="nav-item">
                    <button className="nav-link btn btn-primary
                    btn-sm text-light ml-2 rounded"
                        onClick={this.props.logout}
                    >Выйти
                    </button>
                </li>
            </ul>
        );
        const guestLinks = (
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                <li className="nav-item">
                    <Link to="/login" className="nav-link">Логин</Link>
                </li>
            </ul>
        );

        return (
            <div>
                <nav className="navbar navbar-expand-sm navbar-light bg-light">

                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01"
                        aria-expanded="false"
                        aria-label="Toggle navigation">
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <a className="navbar-brand ml-3" href="/">Главная страница</a>
                        {isAuthenticated ? authLinks : guestLinks}

                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);