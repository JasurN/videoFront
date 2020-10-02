import React, {Component} from 'react';
import {Button, Col, Form} from "react-bootstrap";
import {Form as FormSemantic} from "semantic-ui-react";
import {getDepartments, getRoomsList, getUserTypes, updateUser} from "../../helpers/api";
import {makeTwoStrToLowerCaseAndConcat} from "../../helpers";
import {connect} from "react-redux";
import {createMessage} from "../../store/actions/messages";

class UserInfoChangeForm extends Component {
    state = {
        user_id: -1,
        first_name: '',
        last_name: '',
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

    async componentDidMount() {
        this.getDepartmentsAndSetToState();
        this.getUserTypeAndSetToState();
        this.getRoomsAndSetToState();
        const {
            user_id, first_name, last_name, department, room,
            userType
        } = this.props.selected_user;
        this.setState({
            user_id,
            first_name,
            last_name,
            departamentSelected: department,
            roomSelected: room,
            userTypeSelected: userType
        });
    }

    render() {
        return (
            <div>
                <Button className="mt-3 mb-3"
                        variant="primary"
                        onClick={this.props.handleClick.bind(this)}>Назад К
                    Списку</Button>
                <Form onSubmit={this.onSubmit}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridFirstName">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control type="text" value={this.state.first_name}
                                          name="first_name" onChange={this.onChange}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridLastName">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control type="text" value={this.state.last_name}
                                          name="last_name" onChange={this.onChange}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridProfilePhoto">
                            <Form.Label>Фото Профиля</Form.Label>
                            <Form.File label="Фото профиля" custom onChange={this.onSelectFileHandler}/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridNewPassword">
                            <Form.Label>Новый пароль</Form.Label>
                            <Form.Control type="password" placeholder="Новый пароль"
                                          name="password" onChange={this.onChange}/>
                        </Form.Group>
                        <Form.Group as={Col} controlId="formGridReNewPassword">
                            <Form.Label>Повторите Новый пароль</Form.Label>
                            <Form.Control type="password" placeholder="Новый пароль"
                                          name="password2" onChange={this.onChange}/>
                        </Form.Group>
                    </Form.Row>
                    <FormSemantic.Group widths='equal'>
                        <FormSemantic.Select
                            className="mr-5"
                            fluid
                            label='Департамент'
                            options={this.state.departments_options}
                            onChange={this.handleDepartmentChange}
                            value={this.state.departamentSelected}
                            required
                        />
                        <FormSemantic.Select
                            className="mr-5"
                            fluid
                            label='Тип пользователя'
                            name="options"
                            options={this.state.userTypesOptions}
                            onChange={this.handleUserOptionsChange}
                            value={this.state.userTypeSelected}
                            required
                        />
                        <FormSemantic.Select
                            className="mr-5"
                            fluid
                            label='Кабинет следователя'
                            options={this.state.roomsTypesOptions}
                            onChange={this.handleRoomOptionsChange}
                            value={this.state.roomSelected}
                            required
                        />
                    </FormSemantic.Group>
                    <div className="form-group text-center">
                        <Button variant="primary" type="submit" className="mt-3">
                            Обновить данные
                        </Button>
                    </div>
                </Form>
            </div>
        );
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

    onSubmit = async event => {
        event.preventDefault();
        const {
            user_id, password, password2, first_name, last_name, departamentSelected,
            userTypeSelected, roomSelected, selectedFile
        } = this.state;
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
            const username = makeTwoStrToLowerCaseAndConcat(first_name, last_name);
            const newUser = {
                user_id: user_id,
                username: username,
                first_name: first_name,
                last_name: last_name,
                password: password,
                department: department,
                userType: userType,
                room: roomId,
                file: selectedFile
            };

            const result = await updateUser(newUser);
            if(result) {
                this.props.handleClick();
            }
        }
    };

    handleDepartmentChange = (e, {value}) => this.setState({departamentSelected: value});
    handleUserOptionsChange = (e, {value}) => this.setState({userTypeSelected: value});
    handleRoomOptionsChange = (e, {value}) => this.setState({roomSelected: value});

    onSelectFileHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    };

    getSelectedItemId(selectedItem, optionsList) {
        return optionsList.find(item => item.text === selectedItem).key;
    }

    onChange = event => this.setState({
        [event.target.name]: event.target.value
    });
}

export default connect(null, {createMessage})(UserInfoChangeForm);
