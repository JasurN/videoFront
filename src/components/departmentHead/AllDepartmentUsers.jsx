import React, { Component } from 'react';
import {  Card, CardDeck, Container } from "react-bootstrap";
import { getUsersList } from "../../helpers/api";

class AllDepartmentUsers extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    state = {
        user: {},
        usersListWithCards: [],
        showUsersList: true,
        showUserChangeForm: false,
        selected_user_id: -1,
        selected_user: {}
    };

    async componentDidMount() {
        this.getUsersAndSetToState();
    }

    render() {
        return (
            <Container>
                {this.state.showUsersList && this.state.usersListWithCards}
            </Container>
        );
    }

    async getUsersAndSetToState() {
        let department = localStorage.getItem('department')
        await getUsersList()
            .then(usersLists => {
                console.log(usersLists)
                let prevDepartment = '';
                let usersListWithCards = (<div />);
                if (usersLists.length > 0) {
                    usersListWithCards = usersLists.map(user_item => {
                        if (user_item.department === department) {
                            const currentDepartment = user_item.department;
                            return (<div key={user_item.user_id}>
                                {currentDepartment !== prevDepartment ?
                                    (<h3 className="mt-3">{prevDepartment = currentDepartment}</h3>) : (<div />)}
                                <CardDeck style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
                                    <Card className="mt-3" style={{ flex: 1, }}>
                                        <Card.Img className="profileImage" variant="top"
                                            src={user_item.profileImage}
                                            style={{ width: '10em', height: '10em' }} />
                                        <Card.Body>
                                            <Card.Title>{`${user_item.first_name} ${user_item.last_name}`}</Card.Title>
                                            <Card.Text>
                                                Должность: {user_item.userType}
                                            </Card.Text>
                                            <Card.Text>
                                                Кабинет: {user_item.room}
                                            </Card.Text>
                                        </Card.Body>
                                        {/* <Button variant="primary" style={{ maxWidth: "20%" }}
                                            user_id={user_item.user_id}
                                            first_name={user_item.first_name}
                                            last_name={user_item.last_name}
                                            department={user_item.department}
                                            room={user_item.room}
                                            userType={user_item.userType}
                                            onClick={this.goToUserProfileChange}>Изменить данные</Button> */}
                                    </Card>
                                </CardDeck>
                            </div>)
                        }
                        return <div/>
                    });
                    this.setState({
                        usersListWithCards: usersListWithCards
                    })
                }
            })
    }

    // goToUserProfileChange = (event) => {
    //     const user_id = parseInt(event.currentTarget.getAttribute("user_id"));
    //     const first_name = event.currentTarget.getAttribute("first_name");
    //     const last_name = event.currentTarget.getAttribute("last_name");
    //     const department = event.currentTarget.getAttribute("department");
    //     const room = event.currentTarget.getAttribute("room");
    //     const userType = event.currentTarget.getAttribute("userType");

    //     const selected_user = {
    //         user_id, first_name, last_name, department, room, userType
    //     };

    //     this.setState({
    //         showUsersList: false,
    //         showUserChangeForm: true,
    //         selected_user_id: user_id,
    //         selected_user: selected_user
    //     })
    // };

    handleClick() {
        this.setState({
            showUsersList: true,
            showUserChangeForm: false,
        });
        this.getUsersAndSetToState();

    }
}

export default AllDepartmentUsers;