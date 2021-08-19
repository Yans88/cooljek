import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchDataById, addData, clearError, closeForm, chgProps, resetForm } from './faqSlice'
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';
import { Placeholder, Alert } from 'rsuite';
import { Col, Form } from 'react-bootstrap';

class FaqForm extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            id_faq: '',
            id_operator: '',
            answer: '',
            question: ''
        }
        this.state = {
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
            id_operator: '',
        }
    }

    componentDidMount() {
        const selectedId = sessionStorage.getItem('idFAQ');
        const tipe = sessionStorage.getItem('tipe');
        const idOP = sessionStorage.getItem('idOP');
        if (selectedId > 0) {
            const param = { id_faq: selectedId }
            this.props.onLoad(param);
        }
        if (tipe > 0) {
            const dt = { key: "tipe", value: tipe };
            this.props.changeProps(dt);
        }
        if (idOP > 0) {
            const dt = { key: "id_operator", value: idOP };
            this.props.changeProps(dt);
        }
    }

    handleSubmit() {
        const dt = { key: "id_operator", value: this.props.user.id_operator };
        this.props.changeProps(dt);
        var errors = this.state.errMsg;
        errors.answer = !this.props.data.answer ? "Answer required" : '';
        errors.question = !this.props.data.answer ? "Question required" : '';
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.props.data);
        } else {
            console.error('Invalid Form')
            Object.values(errors).forEach(
                (val) => Alert.error(val, 5000)
            );
        }

    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleClose = () => {
        this.props.closeModal();
        this.setState({
            errMsg: {},
            selected: this.initSelected,
            loadingForm: false
        });
    };

    handleChangeDesk(name, value) {
        const dt = { key: "id_operator", value: this.props.user.id_operator };
        name === 'answer' && this.props.changeProps(dt);
        dt['key'] = name;
        dt['value'] = value;
        this.props.changeProps(dt);
    }

    render() {
        const { data } = this.props;
        const { Paragraph } = Placeholder;

        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Add/Edit FAQ</h1>
                            </div>{/* /.col */}

                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success shadow-lg" style={{ "minHeight": "800px" }}>

                                    <div className="card-body">
                                        {this.props.isLoading ? (<Paragraph rowHeight={25} rowMargin={30} rows={10} active style={{ marginTop: 30 }} />) : (

                                            <Form style={{ marginTop: 20 }}>
                                                <Form.Row>
                                                    <Form.Group as={Col} xs={6} controlId="question">
                                                        <Form.Label>Question</Form.Label>
                                                        <SunEditor
                                                            defaultValue={data.question}
                                                            setContents={data.question}
                                                            onChange={this.handleChangeDesk.bind(this, 'question')}
                                                            setOptions={{
                                                                placeholder: "Question ...",
                                                                maxHeight: 600,
                                                                height: 600,
                                                                buttonList: [
                                                                    ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                ]
                                                            }}
                                                        />
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={6} controlId="answer">
                                                        <Form.Label>Answer</Form.Label>
                                                        <SunEditor
                                                            defaultValue={data.answer}
                                                            setContents={data.answer}
                                                            onChange={this.handleChangeDesk.bind(this, 'answer')}
                                                            setOptions={{
                                                                placeholder: "Answer ...",
                                                                maxHeight: 600,
                                                                height: 600,
                                                                buttonList: [
                                                                    ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                ]
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </Form.Row>

                                                <AppButton
                                                    onClick={this.handleSubmit.bind(this)}
                                                    className="float-right"
                                                    isLoading={this.props.isAddLoading}
                                                    type="button"
                                                    theme="success">
                                                    Simpan
                                                </AppButton>
                                                <button style={{ marginRight: 5 }} type="button" onClick={() => this.props.history.goBack()} className="float-right btn btn-danger">Back</button>

                                            </Form>
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {this.props.showFormSuccess ? (<AppSwalSuccess
                    show={this.props.showFormSuccess}
                    title={<div dangerouslySetInnerHTML={{ __html: this.props.contentMsg }} />}
                    type={this.props.tipeSWAL}
                    handleClose={this.props.isError ? this.props.closeSwalError : this.props.closeSwal}
                >
                </AppSwalSuccess>) : ''}
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    data: state.faq.dataId || {},
    isError: state.faq.isError,
    isLoading: state.faq.isLoading,
    isAddLoading: state.faq.isAddLoading,
    errorPriority: state.faq.errorPriority || null,
    contentMsg: state.faq.contentMsg || null,
    showFormSuccess: state.faq.showFormSuccess,
    tipeSWAL: state.faq.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchDataById(param));
        },
        onAdd: (param) => {
            dispatch(addData(param));
        },
        changeProps: (data) => {
            dispatch(chgProps(data));
        },
        resetError: () => {
            dispatch(clearError());
        },
        closeSwal: () => {
            dispatch(closeForm());
            dispatch(resetForm());
        },
        closeSwalError: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(FaqForm);