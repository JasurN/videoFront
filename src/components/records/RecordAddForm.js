import React, { Component } from 'react'
import { Form } from 'semantic-ui-react'
import { addRecord } from "../../store/actions/records";

class RecordAddForm extends Component {
    state = {
        record_id: '',
        short_description: ''
    };

    render() {
        const { record_id, short_description } = this.state;
        return (
            <Form onSubmit={this.onSubmit}>
                <h2>Создать дело</h2>
                <Form.Group>
                    <Form.Input name="record_id" className="deloInput"
                        placeholder='Напишите пожалуйста ID дело'
                        onChange={this.handleChange}
                        value={record_id}
                        required
                    />
                </Form.Group>
                <Form.TextArea name="short_description" label='Короткое описание'
                    placeholder='Напишите пожалуйста короткое описание дела'
                    value={short_description} onChange={this.handleChange} />
                <Form.Button primary>Создать</Form.Button>
            </Form>
        )
    }

    onSubmit = async event => {
        event.preventDefault();
        const { record_id, short_description } = this.state;
        await addRecord(record_id, short_description);
        this.clearInputs();
    };

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    clearInputs() {
        this.setState({
            record_id: '',
            short_description: ''
        })
    }
}

export default RecordAddForm;