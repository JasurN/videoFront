import React, {Component} from 'react'
import {Container, Divider, Form} from 'semantic-ui-react'
import {connect} from 'react-redux';
import {makeTwoStrToLowerCaseAndConcat} from "../../helpers";
import {getDepartments, getRoomsList, getUserTypes} from "../../helpers/api";
import {register} from "../../store/actions/auth";
import {createMessage} from "../../store/actions/messages";
import PropTypes from "prop-types";
import {Redirect} from "react-router-dom";

class Register extends Component {
    state = {
        firstName: '',
        lastName: '',
        password: '',
        password2: '',
        departamentSelected: '',
        userTypeSelected: '',
        roomSelected: '',
        departments_options: [],
        userTypesOptions: [],
        roomsTypesOptions: [],
        selectedFile: ''
    };

    static propTypes = {
        register: PropTypes.func.isRequired,
        isAuthenticated: PropTypes.bool,
        getDepartments: PropTypes.func.isRequired,
        getUserTypes: PropTypes.func.isRequired
    };

    async componentDidMount() {
        this.getDepartmentsAndSetToState();
        this.getUserTypeAndSetToState();
        this.getRoomsAndSetToState();
    }

    render() {
        if (!this.props.isAuthenticated) {
            return <Redirect to="/login/"/>
        }
        const {firstName, lastName, password, password2} = this.state;
        return (
            <Container>
                <Divider/>
                <Form onSubmit={this.onSubmit}>
                    <h2 className="text-center">Регистрация нового пользователя</h2>
                    <Form.Group widths='equal'>
                        <Form.Input name="firstName" fluid label='Имя' placeholder='Имя'
                                    value={firstName} onChange={this.onChange}
                                    required/>
                        <Form.Input name="lastName" fluid label='Фамилия' placeholder='Фамилия'
                                    value={lastName} onChange={this.onChange}
                                    required/>

                        <Form.Input type="file"
                            name="photoProfile" fluid label='Фото Профиля'
                                    placeholder='Фото Профиля' onChange={this.onSelectFileHandler}
                                    required/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Input type="password" name="password" fluid label='Пароль'
                                    placeholder='Пароль' value={password} onChange={this.onChange}
                                    required/>
                        <Form.Input type="password" name="password2" fluid label='Повторите Пароль'
                                    placeholder='Повторите Пароль' value={password2} onChange={this.onChange}
                                    required/>
                    </Form.Group>
                    <Form.Group widths='equal'>
                        <Form.Select
                            fluid
                            label='Департамент'
                            options={this.state.departments_options}
                            onChange={this.handleDepartmentChange}
                            required
                        />
                        <Form.Select
                            fluid
                            label='Тип пользователя'
                            name="options"
                            options={this.state.userTypesOptions}
                            onChange={this.handleUserOptionsChange}
                            required
                        />
                        <Form.Select
                            fluid
                            label='Кабинет следователя'
                            options={this.state.roomsTypesOptions}
                            onChange={this.handleRoomOptionsChange}
                            required
                        />
                    </Form.Group>
                    <Divider/>
                    <div className="form-group text-center">
                        <button type="submit" className="btn btn-success btn-lg rounded-lg">
                            Зарегистрировать
                        </button>
                    </div>
                </Form>
            </Container>
        )
    }

    async getDepartmentsAndSetToState() {
        await getDepartments()
            .then(departments_list => {
                this.setState({
                    departments_options: this.mapListToSelectOptions(departments_list)
                });
            });
    }

    async getUserTypeAndSetToState() {
        await getUserTypes()
            .then(userLists => {
                this.setState({
                    userTypesOptions: this.mapListToSelectOptions(userLists)
                })
            })
    }

    async getRoomsAndSetToState() {
        await getRoomsList()
            .then(userLists => {
                this.setState({
                    roomsTypesOptions: this.mapListToSelectOptions(userLists)
                })
            })
    }

    mapListToSelectOptions(items_list) {
        let itemsOptions = [];
        items_list.forEach(item => itemsOptions.push({
            key: item.id,
            text: item.name,
            value: item.name
        }));
        return itemsOptions.filter(items => items.text !== "Супер Админ");
    }

    onSubmit = event => {
        event.preventDefault();
        const {password, password2, firstName, lastName, departamentSelected,
            userTypeSelected, roomSelected, selectedFile} = this.state;
        if (password !== password2) {
            this.props.createMessage({passwordNotMatch: "Пароли не совпадают"})
        } else {
            if (departamentSelected === '' || userTypeSelected === ''
                || roomSelected === '') {
                this.props.createMessage({fillAllFields: "Заполните все поля"});
                return;
            }
            const department = this.getSelectedItemId(departamentSelected, this.state.departments_options);
            const userType = this.getSelectedItemId(userTypeSelected, this.state.userTypesOptions);
            const roomId = this.getSelectedItemId(roomSelected, this.state.roomsTypesOptions);
            const username = makeTwoStrToLowerCaseAndConcat(firstName, lastName);
            const newUser = {
                username: username,
                first_name: firstName,
                last_name: lastName,
                password: password,
                department: department,
                userType: userType,
                room: roomId,
                file: selectedFile
            };
            this.props.register(newUser);
            this.clearInputs();

        }
    };

    getSelectedItemId(selectedItem, optionsList) {
        return optionsList.find(item => item.text === selectedItem).key;
    }

    onChange = event => this.setState({
        [event.target.name]: event.target.value
    });

    handleDepartmentChange = (e, {value}) => this.setState({departamentSelected: value});
    handleUserOptionsChange = (e, {value}) => this.setState({userTypeSelected: value});
    handleRoomOptionsChange = (e, {value}) => this.setState({roomSelected: value});

    onSelectFileHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    };

    clearInputs() {
        this.setState({
            firstName: '',
            lastName: '',
            password: '',
            password2: '',
        })
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {register, createMessage})(Register);