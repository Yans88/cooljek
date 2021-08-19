import React, { Component } from 'react'
import { Col, Figure, Form } from 'react-bootstrap'
import { Button, Placeholder } from 'rsuite';
import noImg from '../../assets/noPhoto.jpg'
import { connect } from 'react-redux';
import moment from 'moment';
import "moment/locale/id";
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import NumberFormat from 'react-number-format';
import { addData, fetchDataDetail, chgProps, closeForm, clearError } from './vouchersSlice'
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import AppButton from '../../components/button/Button';

var yesterday = moment().subtract(1, 'day');
var valid_startDate = function (current) {
    return current.isAfter(yesterday);
};

class FormVoucher extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            title: '',
            img: ''
        }
        this.state = {
            validSd: valid_startDate,
            validEd: valid_startDate,
            addLoading: false,
            img: '',
            kode_voucher: '',
            imgUpload: noImg,
            errMsg: this.initSelected,
            isLoading: false,
        }
        this.handleChangeStartDate = this.handleChangeStartDate.bind(this);
        this.handleChangeEndDate = this.handleChangeEndDate.bind(this);
        this.handleChangeDesk = this.handleChangeDesk.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const selectedId = sessionStorage.getItem('idVoucherCooljek');
        if (selectedId > 0) {
            this.getData();
        }
        this.setState({ id_operator: this.props.user.id_operator });
    }

    getData = () => {
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
        const selectedId = sessionStorage.getItem('idVoucherCooljek');
        const queryString = { id: selectedId }
        this.props.onLoad(queryString);
    };

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        errors.title = !this.props.dtRes.title ? "Title required" : '';
        errors.tipe_voucher = !this.props.dtRes.tipe_voucher ? "Tipe diskon required" : '';
        errors.img = !this.state.img && !this.props.dtRes.img ? "Image required" : '';
        errors.img = !this.state.img && this.state.img.size > 2099200 ? "File size over 2MB" : errors.img;
        errors.nilai_potongan = !this.props.dtRes.nilai_potongan ? "Potongan Required" : '';
        errors.deskripsi = !this.props.dtRes.deskripsi ? "Description Required" : '';
        errors.start_date = !this.props.dtRes.start_date && "Start date required";
        errors.end_date = !this.props.dtRes.end_date && "End date required";
        errors.kode_voucher = !this.props.dtRes.kode_voucher && "Kode voucher required";
        this.setState({ ...this.state, addLoading: true });
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            const param = {
                ...this.props.dtRes,
                'img': this.state.img
            }
            console.log(param);
            this.props.onAdd(param);
        } else {
            console.error('Invalid Form')
        }
        // this.setState({
        //     ...this.state,
        //     loadingForm: false,
        // });
    }

    handleClose() {
        this.props.closeSwal();
        this.props.history.push('/vouchers');
    }

    handleChange(evt) {
        const name = evt.target.name;
        var value = evt.target.value;
        const dt = { key: "id_operator", value: this.props.user.id_operator };

        if (evt.target.name === "img") {
            value = evt.target.files[0];
            this.setState({ img: '' })
            if (!value) return;
            if (!value.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ errMsg: { img: "Extension Invalid" } })
                this.setState({ addLoading: true })
                dt['key'] = "imgUpload";
                dt['value'] = '';
                dt['key'] = "img";
                dt['value'] = '';
                this.props.changeProps(dt);
                return;
            }
            if (value.size > 2099200) {
                this.setState({ errMsg: { img: "File size over 2MB" } })
                this.setState({ addLoading: true })
                dt['key'] = "imgUpload";
                dt['value'] = '';
                dt['key'] = "img";
                dt['value'] = '';
                this.props.changeProps(dt);
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(value);
            reader.onloadend = () => {
                dt['key'] = "imgUpload";
                dt['value'] = reader.result;
                this.props.changeProps(dt);
                this.setState({ ...this.state, img: value })
            };
        }

        this.setState({
            ...this.state,
            addLoading: false,
            errMsg: {
                ...this.state.errMsg,
                [name]: ''
            }
        })
        dt['key'] = name;
        dt['value'] = value;
        if (evt.target.name === "img") {
            dt['value'] = '';
        }
        this.props.changeProps(dt);
        if (name === 'kode_voucher') {
            this.props.resetError();
        }
        //this.setState({ id_operator: this.props.user.id_operator });

    }

    handleChangeDesk(evt) {
        const dt = { key: "id_operator", value: this.props.user.id_operator };
        this.setState({
            ...this.state,
            errMsg: {
                ...this.state.errMsg,
                deskripsi: ''
            }
        });
        dt['key'] = "deskripsi";
        dt['value'] = evt;
        this.props.changeProps(dt);
    }

    handleChangeStartDate(date) {
        this.setState({ ...this.state, errMsg: { ...this.state.errMsg, start_date: '' } })
        const dt = { key: "id_operator", value: this.props.user.id_operator };
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD');
            dt['key'] = "start_date";
            dt['value'] = _date;
        } else {
            dt['key'] = "start_date";
            dt['value'] = '';
        }
        this.props.changeProps(dt);
    }

    handleChangeEndDate(date) {
        this.setState({ ...this.state, errMsg: { ...this.state.errMsg, end_date: '' } })
        const dt = { key: "id_operator", value: this.props.user.id_operator };
        if (date) {
            const selectedDate = new Date(date);
            const _date = moment(selectedDate).format('YYYY-MM-DD');
            dt['key'] = "end_date";
            dt['value'] = _date;
        } else {
            dt['key'] = "end_date";
            dt['value'] = '';
        }
        this.props.changeProps(dt);
    }

    renderView(mode, renderDefault, name) {
        // Only for years, months and days view
        if (mode === "time") return renderDefault();

        return (
            <div className="wrapper">
                {renderDefault()}
                <div className="controls">
                    <Button variant="warning" type="button" onClick={() => this.clear(name)}>Clear</Button>
                </div>
            </div>
        );
    }

    clear(name) {
        if (name === "end_date") {
            this.handleChangeEndDate();
        }
        if (name === "start_date") {
            this.handleChangeStartDate();
        }
    }
    render() {
        const { dtRes, errorPriority } = this.props;
        const { Paragraph } = Placeholder;
        const { errMsg } = this.state;

        return (
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Add/Edit Voucher</h1>
                            </div>{/* /.col */}

                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success shadow-lg">

                                    <div className="card-body">
                                        {this.props.isLoading ? (<Paragraph rowHeight={25} rowMargin={30} rows={8} active style={{ marginTop: 30 }} />) : (
                                            <Form id="myForm">

                                                <Form.Row>
                                                    <Form.Group as={Col} xs={6} controlId="title">
                                                        <Form.Label>Title</Form.Label>

                                                        <Form.Control
                                                            value={dtRes.title ? dtRes.title : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="title"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Title" />
                                                        {errMsg.title && (<span className="text-error badge badge-danger">{errMsg.title}</span>)}

                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="tipe_voucher">
                                                        <Form.Label>Tipe Diskon</Form.Label>

                                                        <Form.Control
                                                            value={dtRes.tipe_voucher}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            as="select"
                                                            name="tipe_voucher">
                                                            <option>Tipe Diskon ...</option>
                                                            <option value="1">IDR</option>
                                                            <option value="2">Persentase(%)</option>
                                                        </Form.Control>

                                                        {errMsg.tipe_voucher && (<span className="text-error badge badge-danger">{errMsg.tipe_voucher}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="nilai_potongan">
                                                        <Form.Label>Potongan</Form.Label>
                                                        <NumberFormat
                                                            name="nilai_potongan"
                                                            onChange={this.handleChange}
                                                            className="form-control form-control-sm"
                                                            value={dtRes.nilai_potongan}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Potongan" />
                                                        {errMsg.nilai_potongan && (<span className="text-error badge badge-danger">{errMsg.nilai_potongan}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} controlId="maks_potongan">
                                                        <Form.Label>Maks. Diskon(IDR)</Form.Label>
                                                        <NumberFormat
                                                            disabled={dtRes.tipe_voucher === "2" || dtRes.tipe_voucher === 2 ? false : true}
                                                            name="maks_potongan"
                                                            onChange={this.handleChange}
                                                            className="form-control form-control-sm"
                                                            value={dtRes.maks_potongan}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Maks. Diskon(IDR)" />
                                                    </Form.Group>

                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col} xs={6} controlId="kode_voucher">
                                                        <Form.Label>Kode voucher</Form.Label>

                                                        <Form.Control
                                                            value={dtRes.kode_voucher ? dtRes.kode_voucher : ''}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="kode_voucher"
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Kode voucher" />
                                                        {errMsg.kode_voucher && (<span className="text-error badge badge-danger">{errMsg.kode_voucher}</span>)}
                                                        {errorPriority && (<span className="text-error badge badge-danger">{errorPriority}</span>)}
                                                    </Form.Group>

                                                    <Form.Group as={Col} xs={2} controlId="start_date">
                                                        <Form.Label>Start Date</Form.Label>
                                                        <Datetime
                                                            closeOnSelect={true}
                                                            timeFormat={false}
                                                            setViewDate={dtRes.start_date ? (new Date(dtRes.start_date)) : new Date()}
                                                            value={dtRes.start_date ? (new Date(dtRes.start_date)) : ''}
                                                            onChange={this.handleChangeStartDate}
                                                            inputProps={{
                                                                readOnly: true,
                                                                autoComplete: "off",
                                                                placeholder: 'Start Date',
                                                                name: 'start_date',
                                                                className: 'form-control form-control-sm'
                                                            }}
                                                            renderView={(mode, renderDefault, start_date) =>
                                                                this.renderView(mode, renderDefault, 'start_date')
                                                            }
                                                            locale="id" isValidDate={this.state.validSd}
                                                        />
                                                        {errMsg.start_date && (<span className="text-error badge badge-danger">{errMsg.start_date}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="end_date">
                                                        <Form.Label>End Date</Form.Label>
                                                        <Datetime
                                                            closeOnSelect={true}
                                                            timeFormat={false}
                                                            setViewDate={dtRes.end_date ? (new Date(dtRes.end_date)) : new Date()}
                                                            value={dtRes.end_date ? (new Date(dtRes.end_date)) : ''}
                                                            onChange={this.handleChangeEndDate}
                                                            inputProps={{
                                                                readOnly: true,
                                                                placeholder: 'End Date', autoComplete: "off",
                                                                name: 'end_date', className: 'form-control form-control-sm'
                                                            }}
                                                            renderView={(mode, renderDefault) =>
                                                                this.renderView(mode, renderDefault, 'end_date')
                                                            }
                                                            locale="id" isValidDate={this.state.validEd}
                                                        />
                                                        {errMsg.end_date && (<span className="text-error badge badge-danger">{errMsg.end_date}</span>)}
                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="min_pembelian">
                                                        <Form.Label>Min. Pembelian(IDR)</Form.Label>
                                                        <NumberFormat
                                                            name="min_pembelian"
                                                            onChange={this.handleChange}
                                                            className="form-control form-control-sm"
                                                            value={dtRes.min_pembelian}
                                                            thousandSeparator={true}
                                                            decimalScale={2}
                                                            inputMode="numeric"
                                                            autoComplete="off"
                                                            placeholder="Min. Pembelian(IDR)" />
                                                    </Form.Group>
                                                </Form.Row>

                                                <Form.Row>
                                                    <Form.Group as={Col} xs={8} controlId="deskripsi">
                                                        <Form.Label>Description</Form.Label>
                                                        {errMsg.deskripsi && (<span className="float-right text-error badge badge-danger">{errMsg.deskripsi}</span>)}
                                                        <SunEditor
                                                            defaultValue={dtRes.deskripsi}
                                                            setContents={dtRes.deskripsi}
                                                            onChange={this.handleChangeDesk}
                                                            setOptions={{
                                                                placeholder: "Description ...",
                                                                maxHeight: 160,
                                                                height: 160,
                                                                buttonList: [
                                                                    ['fontSize', 'formatBlock', 'bold', 'underline', 'italic', 'align', 'horizontalRule', 'list', 'lineHeight', 'link', 'strike', 'subscript', 'superscript', 'codeView', 'undo', 'redo', 'fontColor', 'hiliteColor', 'textStyle', 'paragraphStyle', 'blockquote', 'removeFormat']
                                                                ]
                                                            }}
                                                        />


                                                    </Form.Group>
                                                    <Form.Group as={Col} xs={2} controlId="img">
                                                        <Form.Label>Image</Form.Label>
                                                        {errMsg.img ? (<span className="float-right text-error badge badge-danger">{errMsg.img}</span>) : ''}
                                                        <Form.File
                                                            setfieldvalue={this.state.img}
                                                            onChange={this.handleChange}
                                                            size="sm"
                                                            name="img"
                                                            style={{ "color": "rgba(0, 0, 0, 0)" }} />
                                                        <Form.Text className="text-muted">
                                                            <em>- Images *.jpg, *.jpeg, *.png <br />- Maks. Size 2MB</em>
                                                        </Form.Text>

                                                    </Form.Group>

                                                    {dtRes.img || dtRes.imgUpload ? (
                                                        <Form.Group as={Col} xs={2} controlId="imagePreview">
                                                            <Form.Label style={{ "color": "rgba(0, 0, 0, 0)" }}>-----</Form.Label>
                                                            <Figure>
                                                                <Figure.Image
                                                                    thumbnail
                                                                    width={130}
                                                                    height={100}
                                                                    alt=""
                                                                    src={dtRes.img ? dtRes.img : dtRes.imgUpload}
                                                                />
                                                            </Figure>
                                                        </Form.Group>
                                                    ) : ''}


                                                </Form.Row>

                                                <button style={{ marginRight: 5 }} type="button" onClick={() => this.props.history.goBack()} className="btn btn-danger">Back</button>
                                                {!dtRes.publish_by ? (<AppButton
                                                    onClick={this.handleSubmit.bind(this)}

                                                    isLoading={this.props.isAddLoading || this.state.addLoading}
                                                    type="button"
                                                    theme="success">
                                                    Simpan
                                                </AppButton>) : ''}

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
                    handleClose={this.handleClose.bind(this)}
                >
                </AppSwalSuccess>) : ''}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        dtRes: state.vouchers.dtRes || [],
        user: state.main.currentUser,
        isLoading: state.vouchers.isLoading,
        isError: state.vouchers.isError,
        isAddLoading: state.vouchers.isAddLoading,
        contentMsg: state.vouchers.contentMsg || null,
        showFormSuccess: state.vouchers.showFormSuccess,
        tipeSWAL: state.vouchers.tipeSWAL,
        errorPriority: state.vouchers.errorPriority || null,
    }
}

const mapDispatchToPros = (dispatch) => {
    return {
        onAdd: (data) => {
            dispatch(addData(data));
        },
        onLoad: (param) => {
            dispatch(fetchDataDetail(param));
        },
        changeProps: (data) => {
            dispatch(chgProps(data));
        },
        closeSwal: () => {
            dispatch(closeForm());
        },
        resetError: () => {
            dispatch(clearError());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(FormVoucher);