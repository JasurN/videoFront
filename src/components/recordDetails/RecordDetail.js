import React, {Component} from 'react';
import {Button, Container, Divider, Form, Input, Table} from "semantic-ui-react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
    addRecordDetail, getRecordDetails,
    playRecordDetail, stopRecordDetail,
    removeRecordDetail
} from "../../store/actions/recordDetails";
import {getSubCategories} from "../../helpers/api";
import {uploadRecordDetailFileToServer} from "../../store/actions/files";

import '../../style/RecordDetail.css';
import {confirmAlert} from "react-confirm-alert";


class RecordDetail extends Component {
    state = {
        sub_category_options: [],
        short_description: '',
        subCategorySelected: '',
        deleteConfirmOpen: false,
        selectedRecordId: -1,
        selectedFile: null
    };

    static propTypes = {
        selectedRecord: PropTypes.array.isRequired,
        recordDetails: PropTypes.array.isRequired,
        getRecords: PropTypes.func,
        getRecordDetails: PropTypes.func,
        playRecordDetail: PropTypes.func,
        stopRecordDetail: PropTypes.func,
        removeRecordDetail: PropTypes.func,
        auth: PropTypes.object.isRequired,
    };

    componentDidMount = async () => {
        this.props.getRecordDetails(this.props.selectedRecord.id);
        this.getSubCategoriesAndSetToState();
    };

    render() {
        const {user_info, user} = this.props.auth;

        const buttonPlayAndSendVideo = (
            <div>
                <Button
                    positive onClick={this.playRecordDetail}>Запись Видео
                </Button>
                <h5>Или загрузуть файл самому</h5>
                <Input type="file" name="file" onChange={this.onSelectFileHandler}
                       className="marginTop5"/>
                <Button primary onClick={this.uploadVideoOnClickHandler}>Отправить
                    файл</Button>
            </div>
        );

        const buttonStopAndConfirm = (
            <Button color="yellow" onClick={this.showStopConfirm}>Стоп видео</Button>);

        const buttonRemoveAndConform = (
            <Button negative onClick={this.showRemoveConfirm}>Удалить файл</Button>);

        const {selectedRecord} = this.props;
        return (
            <Container>
                <Divider/>
                <h2>Дело</h2>
                <Table celled>
                    <Table.Header>
                        <Table.Row key={selectedRecord.id}>
                            <Table.HeaderCell>{selectedRecord.record_id}</Table.HeaderCell>
                            <Table.HeaderCell>{selectedRecord.short_description}</Table.HeaderCell>
                            <Table.HeaderCell> {new Date(selectedRecord.created_at).toLocaleString('ru-RU')}</Table.HeaderCell>
                            {this.props.recordDetails.length > 0
                                ? (<Table.HeaderCell><a
                                    href={`http://localhost:8000/api/records/download/${selectedRecord.id}`}
                                    download>Скачать дело
                                </a></Table.HeaderCell>)
                                : <div/>}
                        </Table.Row>
                    </Table.Header>
                </Table>
                <Divider/>
                <h3>Список подкатегории</h3>
                <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Подкатегории</Table.HeaderCell>
                            <Table.HeaderCell>Краткое описание</Table.HeaderCell>
                            <Table.HeaderCell>Статус</Table.HeaderCell>
                            <Table.HeaderCell>Дата создания</Table.HeaderCell>
                            <Table.HeaderCell>Действия</Table.HeaderCell>
                            <Table.HeaderCell>Ссылка для скачивания</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    {this.props.recordDetails.length > 0 ? <Table.Body>
                        {
                            this.props.recordDetails.map(record_detail_item => {
                                if (record_detail_item.record_detail_status === 'a')
                                    return (
                                        <Table.Row key={record_detail_item.id}>
                                            <Table.Cell>
                                                {record_detail_item.category_id}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {record_detail_item.short_description}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {record_detail_item.status}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {new Date(record_detail_item.created_at).toLocaleString('ru-RU')}
                                            </Table.Cell>
                                            <Table.Cell record_detail_id={record_detail_item.id}>
                                                {user_info ? (user_info.userType.id !== 1 && selectedRecord.owner === user.id && (
                                                        <div>
                                                            {record_detail_item.status === "Не начато" ?
                                                                buttonPlayAndSendVideo
                                                                :
                                                                <div/>
                                                            }
                                                            {record_detail_item.status === "Идет запись" ?
                                                                buttonStopAndConfirm
                                                                :
                                                                <div/>
                                                            }
                                                            {record_detail_item.status === "Файл сохранен" ?
                                                                buttonRemoveAndConform :
                                                                <div/>
                                                            }
                                                        </div>))
                                                    : <div/>}

                                            </Table.Cell>
                                            <Table.Cell>
                                                {record_detail_item.file ?
                                                    <a href={`http://localhost:8000${record_detail_item.file}`}
                                                       download>Скачать</a> :
                                                    <div/>}
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                return <div/>
                            })
                        }
                    </Table.Body> : <div/>
                    }
                </Table>
                {user_info ? (user_info.userType.id !== 1 && selectedRecord.owner === user.id && (
                    <div>
                        <h3>Создание подкатегории</h3>
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group>
                                <Form.Select
                                    label='Покатегории'
                                    options={this.state.sub_category_options}
                                    onChange={this.handleCategorySelectOption}
                                    required/>
                            </Form.Group>
                            <Form.TextArea name="short_description" label='Краткое описание'
                                           placeholder='Напишите краткое описание дела'
                                           value={this.state.short_description} onChange={this.handleChange}/>
                            <Form.Button primary>Создать</Form.Button>
                        </Form>
                    </div>
                )) : <span/>}

            </Container>
        );
    }

    handleCategorySelectOption = (e, {value}) => this.setState({subCategorySelected: value});

    async getSubCategoriesAndSetToState() {
        await getSubCategories()
            .then(departments_list => {
                this.setState({
                    sub_category_options: this.mapListToSelectOptions(departments_list)
                });
            });
    }

    mapListToSelectOptions(items_list) {
        let itemsOptions = [];
        items_list.forEach(item => itemsOptions.push({
            key: item.id,
            text: item.title,
            value: item.title
        }));
        return itemsOptions;
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    onSubmit = async event => {
        event.preventDefault();
        const {subCategorySelected, short_description} = this.state;
        const record_id = this.props.selectedRecord.id;
        const category_id = this.getSelectedItemId(subCategorySelected,
            this.state.sub_category_options);
        await addRecordDetail(record_id,
            short_description, category_id);

    };

    getSelectedItemId(selectedItem, optionsList) {
        return optionsList.find(item => item.text === selectedItem).key;
    }

    playRecordDetail = (event) => {
        const selectedRecordId =
            parseInt(event.currentTarget.parentNode.parentNode.parentNode.getAttribute("record_detail_id"));
        const login = this.props.room.camera_login;
        const password = this.props.room.camera_password;
        const room_name = this.props.room.name;
        const port = this.props.room.port;
        const ipAddress = this.props.room.ip_address;
        const roomInfo = {
            selectedRecordId, login, password, room_name, port, ipAddress
        };

        this.props.playRecordDetail(roomInfo);
    };

    showStopConfirm = (event) => {
        const selectedRecordId =
            parseInt(event.currentTarget.parentNode.parentNode.getAttribute("record_detail_id"));
        this.setState({selectedRecordId: selectedRecordId});
        confirmAlert({
            title: 'Стоп воспроизведения видео',
            message: 'Остановить запись видео?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        const selectedRecordId = this.state.selectedRecordId;
                        this.props.stopRecordDetail(selectedRecordId);
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

    showRemoveConfirm = (event) => {
        const selectedRecordId =
            parseInt(event.currentTarget.parentNode.parentNode.getAttribute("record_detail_id"));
        this.setState({deleteConfirmOpen: true, selectedRecordId: selectedRecordId});
        confirmAlert({
            title: 'Удаление записи',
            message: 'Вы действительно хотите удалить запись?',
            buttons: [
                {
                    label: 'Да',
                    onClick: () => {
                        const selectedRecordId = this.state.selectedRecordId;
                        this.props.removeRecordDetail(selectedRecordId);
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

    onSelectFileHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    };

    uploadVideoOnClickHandler = (event) => {
        if (this.state.selectedFile !== null) {
            const selectedRecordDetailId =
                parseInt(event.currentTarget.parentNode.parentNode.parentNode.getAttribute("record_detail_id"));
            this.props.uploadRecordDetailFileToServer(this.state.selectedFile, selectedRecordDetailId);
        }
    }
}

const mapStateToProps = state => ({
    selectedRecord: state.recordDetails.selectedRecord,
    recordDetails: state.recordDetails.recordDetails,
    room: state.auth.user_info.room,
    auth: state.auth
});

export default connect(mapStateToProps,
    {
        getRecordDetails,
        playRecordDetail,
        stopRecordDetail,
        removeRecordDetail,
        uploadRecordDetailFileToServer
    })(RecordDetail);