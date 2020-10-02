import React, {Component} from 'react'
import {Button, Divider, Table} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {getRecords, removeRecord} from "../../store/actions/records";
import {Link} from "react-router-dom";
import {addSelectedRecordToStory} from "../../store/actions/recordDetails";
import {confirmAlert} from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class RecordsList extends Component {
    state = {
        deleteConfirmOpen: false,
        selectedRecordId: -1
    };

    static propTypes = {
        records: PropTypes.array.isRequired,
        user_type: PropTypes.string.isRequired,
        user_info: PropTypes.object.isRequired,
        getRecords: PropTypes.func,
        addSelectedRecordToStory: PropTypes.func,
        removeRecord: PropTypes.func
    };

    componentDidMount() {
        this.props.getRecords();
    }

    render() {
        const recordsList = this.identifyUserTypeAndGetRecord();
        const {user_type} = this.props;
        console.log(user_type);
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID дела</Table.HeaderCell>
                        <Table.HeaderCell>Краткое описание</Table.HeaderCell>
                        <Table.HeaderCell>Создатель дела</Table.HeaderCell>
                        <Table.HeaderCell>Дата создания</Table.HeaderCell>
                        <Table.HeaderCell>Подробнее</Table.HeaderCell>

                        {/*<Table.HeaderCell>Действия</Table.HeaderCell>*/}
                   {user_type === 'Супер Админ'?'': <Table.HeaderCell>Действия</Table.HeaderCell>}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {recordsList}
                </Table.Body>
                <Divider/>
            </Table>

        )
    }

    MoreInfoLinkOnClickHandler = (event) => {
        const selectedRecordId = parseInt(event.currentTarget.parentNode.getAttribute("record_id"));
        const selectedRecord = this.props.records.find(record_item =>
            record_item.id === selectedRecordId);
        this.props.addSelectedRecordToStory(selectedRecord);
    };

    identifyUserTypeAndGetRecord() {
        const {records, user_type} = this.props;
        if (records.length > 0 && user_type) {
            if (user_type === "Супер Админ") {
                return this.getSuperAdminRecord();
            } else if (user_type === "Начальник отдела") {
                return this.getAdminRecord();
            } else if (user_type === "Следователь") {
                return this.getUserRecord();
            }
        }
    }

    getSuperAdminRecord() {
        return this.props.records.map(record => {
            if (record.status === 'a') {
                return (
                    <Table.Row key={record.id}>
                        <Table.Cell>
                            {record.record_id}
                        </Table.Cell>
                        <Table.Cell>
                            {record.short_description}
                        </Table.Cell>
                        <Table.Cell>
                            {`${record.first_name} ${record.last_name}`}
                        </Table.Cell>
                        <Table.Cell>
                            {new Date(record.created_at).toLocaleString('ru-RU')}
                        </Table.Cell>
                        <Table.Cell record_id={record.id}>
                            <Link onClick={this.MoreInfoLinkOnClickHandler} to="/detail">Подробнее</Link>
                        </Table.Cell>
                    </Table.Row>)
            }
            return <Table.Row/>;
        })
    }

    getAdminRecord() {
        const buttonRemoveAndConform = this.getRemoveAndConfirmButton();
        return this.props.records.map(record => {
            if (record.department === this.props.user_info.department.name && record.status === 'a') {
                return (
                    <Table.Row key={record.id}>
                        <Table.Cell>
                            {record.record_id}
                        </Table.Cell>
                        <Table.Cell>
                            {record.short_description}
                        </Table.Cell>
                        <Table.Cell>
                            {`${record.first_name} ${record.last_name}`}
                        </Table.Cell>
                        <Table.Cell>
                            {new Date(record.created_at).toLocaleString('ru-RU')}
                        </Table.Cell>
                        <Table.Cell record_id={record.id}>
                            <Link onClick={this.MoreInfoLinkOnClickHandler} to="/detail">Подробнее</Link>
                        </Table.Cell>
                        <Table.Cell record_id={record.id}>
                            {this.props.user && this.props.user.id === record.owner && (buttonRemoveAndConform)}
                        </Table.Cell>
                    </Table.Row>)
            }
            return <Table.Row/>;
        })
    }

    getUserRecord() {
        const buttonRemoveAndConform = this.getRemoveAndConfirmButton();
        return this.props.records.map(record => {
            if (record.owner === this.props.user.id && record.status === 'a') {
                return (
                    <Table.Row key={record.id}>
                        <Table.Cell>
                            {record.record_id}
                        </Table.Cell>
                        <Table.Cell>
                            {record.short_description}
                        </Table.Cell>
                        <Table.Cell>
                            {`${record.first_name} ${record.last_name}`}
                        </Table.Cell>
                        <Table.Cell>
                            {new Date(record.created_at).toLocaleString('ru-RU')}
                        </Table.Cell>
                        <Table.Cell record_id={record.id}>
                            <Link onClick={this.MoreInfoLinkOnClickHandler} to="/detail">Подробнее</Link>
                        </Table.Cell>
                        <Table.Cell record_id={record.id}>
                            {buttonRemoveAndConform}
                        </Table.Cell>
                    </Table.Row>)
            }
            return <Table.Row/>;
        })

    }

    getRemoveAndConfirmButton() {
        return (<Button negative onClick={this.deleteRecordSubmit}>Удалить Дело</Button>);
    }

    deleteRecordSubmit = (event) => {
        const selectedRecordId =
            parseInt(event.currentTarget.parentNode.getAttribute("record_id"));
        this.setState({selectedRecordId: selectedRecordId});
        confirmAlert({
            title: 'Удаление дела',
            message: 'Вы действительно хотите удалить дело?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        const selectedRecordId = this.state.selectedRecordId;
                        this.props.removeRecord(selectedRecordId);
                    }
                },
                {
                    label: 'Нет',
                    onClick: () => {
                    }
                }
            ]
        });
    };

}

const mapStateToProps = state => ({
    records: state.records.records,
    user_type: state.auth.user_type,
    user_info: state.auth.user_info,
    user: state.auth.user
});
export default connect(mapStateToProps, {getRecords, addSelectedRecordToStory, removeRecord})(RecordsList);
