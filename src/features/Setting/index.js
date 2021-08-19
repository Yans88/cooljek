import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchData, addData, clearError, closeForm, chgProps } from './settingSlice'
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';
import { Placeholder, Alert } from 'rsuite';
import { Col, Form } from 'react-bootstrap';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import AppButton from '../../components/button/Button';
import NumberFormat from 'react-number-format';

class Setting extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            id_category: '',
            category_name: '',
            id_operator: '',
        }
        this.state = {
            cms: 1,
            errMsg: { email: '' },
        }
    }

    componentDidMount() {
        this.props.onLoad(this.state);
    }

    handleClose = () => {
        this.props.closeModal();
        this.setState({
            errMsg: {},
            selected: this.initSelected,
            loadingForm: false
        });
    };

    handleChange(evt) {
        this.setState({ errMsg: { email: '' } });
        const name = evt.target.name;
        var value = evt.target.value;
        const dt = {};
        dt['key'] = name;
        dt['value'] = value;
        this.props.changeProps(dt);
    }

    handleChangeDesk(name, value) {
        const dt = {};
        dt['key'] = name;
        dt['value'] = value;
        this.props.changeProps(dt);
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        //console.log(this.props.data.send_mail);
        if (this.props.data.send_mail) {
            if (!pattern.test(this.props.data.send_mail)) {
                errors.email = "Please enter valid email address";
            }
        }
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.props.data);
        } else {
            console.error('Invalid Form')
            Alert.error(this.state.errMsg.email, 5000);
        }

    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    closeSwal() {
        this.props.closeSwal();
    }


    render() {
        const { data } = this.props;
        const { Paragraph } = Placeholder;
        const { errMsg } = this.state;

        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Setting</h1>
                            </div>{/* /.col */}

                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success shadow-lg" style={{ "minHeight": "670px" }}>

                                    <div className="card-body">
                                        {this.props.isLoading ? (<Paragraph rowHeight={25} rowMargin={30} rows={10} active style={{ marginTop: 30 }} />) : (
                                            <Form>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="send_mail">
                                                        {errMsg.email ?
                                                            (<span className="float-right text-error badge badge-danger">{errMsg.email}
                                                            </span>) : ''}
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            value={data.send_mail}
                                                            autoComplete="off"
                                                            onChange={this.handleChange.bind(this)}
                                                            size="md"
                                                            name="send_mail"
                                                            type="text"
                                                            placeholder="Email" />
                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="mail_pass">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control
                                                            value={data.mail_pass}
                                                            autoComplete="off"
                                                            onChange={this.handleChange.bind(this)}
                                                            size="md"
                                                            name="mail_pass"
                                                            type="text"
                                                            placeholder="Password" />
                                                    </Form.Group>

                                                </Form.Row>


                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="handling_fee_pertitik">
                                                        <Form.Label>Handling Fee per Titik Antar</Form.Label>
                                                        <NumberFormat
                                                            name="handling_fee_pertitik"
                                                            onChange={this.handleChange.bind(this)}
                                                            className="form-control form-control-sm"
                                                            value={data.handling_fee_pertitik}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Handling Fee per Titik Antar" />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="min_perhitungan_jarak">
                                                        <Form.Label>Min.Perhitungan Jarak(Km)</Form.Label>
                                                        <NumberFormat
                                                            name="min_perhitungan_jarak"
                                                            onChange={this.handleChange.bind(this)}
                                                            className="form-control form-control-sm"
                                                            value={data.min_perhitungan_jarak}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Min.Perhitungan Jarak(Km)" />
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="hrg_instant">
                                                        <Form.Label>Ongkir Instant per Km</Form.Label>
                                                        <NumberFormat
                                                            name="hrg_instant"
                                                            onChange={this.handleChange.bind(this)}
                                                            className="form-control form-control-sm"
                                                            value={data.hrg_instant}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Ongkir Instant per Km" />

                                                    </Form.Group>


                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="hrg_sameday_6km">
                                                        <Form.Label>Ongkir Sameday per Km(0-6Km)</Form.Label>
                                                        <NumberFormat
                                                            name="hrg_sameday_6km"
                                                            onChange={this.handleChange.bind(this)}
                                                            className="form-control form-control-sm"
                                                            value={data.hrg_sameday_6km}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Ongkir Sameday per Km(0-6Km)" />

                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="hrg_sameday_15km">
                                                        <Form.Label>Ongkir Sameday per Km({">"}6-15Km)</Form.Label>
                                                        <NumberFormat
                                                            name="hrg_sameday_15km"
                                                            onChange={this.handleChange.bind(this)}
                                                            className="form-control form-control-sm"
                                                            value={data.hrg_sameday_15km}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Ongkir Sameday per Km(>6-15Km)" />

                                                    </Form.Group>

                                                    <Form.Group as={Col} controlId="hrg_sameday_diatas_15km">
                                                        <Form.Label>Ongkir Sameday per Km({">"}15Km)</Form.Label>
                                                        <NumberFormat
                                                            name="hrg_sameday_diatas_15km"
                                                            onChange={this.handleChange.bind(this)}
                                                            className="form-control form-control-sm"
                                                            value={data.hrg_sameday_diatas_15km}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Ongkir Sameday per Km(>15Km)" />

                                                    </Form.Group>

                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col} xs={12} controlId="content_forgotPass">
                                                        <Form.Label>Content Forgot Password</Form.Label>
                                                        <SunEditor
                                                            defaultValue={data.content_forgotPass}
                                                            setContents={data.content_forgotPass}
                                                            onChange={this.handleChangeDesk.bind(this, 'content_forgotPass')}
                                                            setOptions={{
                                                                placeholder: "Content Forgot Password ...",
                                                                maxHeight: 250,
                                                                height: 250,
                                                                buttonList: [
                                                                    ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                ]
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </Form.Row>
                                                <br />
                                                <Form.Row>
                                                    <Form.Group as={Col} xs={12} controlId="term_condition">
                                                        <Form.Label>Term and Condition</Form.Label>
                                                        <SunEditor
                                                            defaultValue={data.term_condition}
                                                            setContents={data.term_condition}
                                                            onChange={this.handleChangeDesk.bind(this, 'term_condition')}
                                                            setOptions={{
                                                                placeholder: "Term and Condition ...",
                                                                maxHeight: 250,
                                                                height: 250,
                                                                buttonList: [
                                                                    ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                ]
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </Form.Row>

                                                <br />
                                                <Form.Row>
                                                    <Form.Group as={Col} xs={12} controlId="policy">
                                                        <Form.Label>Policy</Form.Label>
                                                        <SunEditor
                                                            defaultValue={data.policy}
                                                            setContents={data.policy}
                                                            onChange={this.handleChangeDesk.bind(this, 'policy')}
                                                            setOptions={{
                                                                placeholder: "Policy ...",
                                                                maxHeight: 250,
                                                                height: 250,
                                                                buttonList: [
                                                                    ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                ]
                                                            }}
                                                        />
                                                    </Form.Group>
                                                </Form.Row>


                                                <AppButton
                                                    onClick={this.handleSubmit.bind(this)}
                                                    isLoading={this.props.isAddLoading}
                                                    type="button"
                                                    theme="success">
                                                    Update Data
                                                </AppButton>


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
    data: state.settings.data || [],
    isError: state.settings.isError,
    isLoading: state.settings.isLoading,
    isAddLoading: state.settings.isAddLoading,
    contentMsg: state.settings.contentMsg || null,
    showFormSuccess: state.settings.showFormSuccess,
    tipeSWAL: state.categories.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
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
        closeSwalError: () => {
            dispatch(closeForm());
            const queryString = {
                cms: 1
            }
            dispatch(fetchData(queryString));
        },
        closeSwal: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Setting);