import React, { Component, Fragment } from 'react'
import { Col, Figure, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchData, addForm, addData, clearError, confirmDel, closeForm, deleteData } from './driversSlice';
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';
import { Message } from 'rsuite';

class Drivers extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            name: '',
            pass: '',
            kendaraan: '',
            email: '',
            phone: '',
            no_pol: '',
            nik: '',
            imgUpload: '',
            photo_ktp: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "name",
            keyword: '',
            page_number: 1,
            per_page: 10,
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
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

    tableChangeHandler = (data) => {
        let queryString = this.state;
        Object.keys(data).map((key) => {
            if (key === "sort_order" && data[key]) {
                queryString.sort_order = data[key].order;
                queryString.sort_column = data[key].column;
            }
            if (key === "page_number") {
                queryString.page_number = data[key];
            }
            if (key === "page_size") {
                queryString.per_page = data[key];
            }
            if (key === "filter_value") {
                queryString.keyword = data[key];
            }
            return true;
        });
        this.props.onLoad(this.state);
    }

    handleChangeNumberOnly = evt => {
        const number = (evt.target.validity.valid) ? evt.target.value : this.state.selected.phone;
        if (evt.target.validity.valid) {
            this.setState({ loadingForm: false, errMsg: { ...this.state.errMsg, phone: "" } });
        }
        this.setState({ selected: { ...this.state.selected, phone: number } });
    }

    handleChangeNumberOnlyNik = evt => {
        const number = (evt.target.validity.valid) ? evt.target.value : this.state.selected.phone;
        if (evt.target.validity.valid) {
            this.setState({ loadingForm: false, errMsg: { ...this.state.errMsg, nik: "" } });
        }
        this.setState({ selected: { ...this.state.selected, nik: number } });
    }

    handleChange(event) {
        const { name, value } = event.target;
        var val = value;
        this.setState({ errMsg: this.initSelected });
        this.props.resetError();
        if (event.target.name === "photo_ktp") {
            val = event.target.files[0];
            this.setState({ selected: { ...this.state.selected, imgUpload: "", photo_ktp: "" } });
            if (!val) return;
            if (!val.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, photo_ktp: "Please select valid image(.jpg .jpeg .png)" } });

                //setLoading(true);
                return;
            }
            if (val.size > 2099200) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, photo_ktp: "File size over 2MB" } });

                //setLoading(true);
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(val);
            reader.onloadend = () => {
                this.setState({ loadingForm: false, selected: { ...this.state.selected, imgUpload: reader.result, photo_ktp: val } });
            };
        }
        this.setState({
            selected: {
                ...this.state.selected,
                [name]: value
            },
            errMsg: {
                ...this.state.errMsg,
                [name]: ''
            }
        });
        this.setState({ loadingForm: false });

        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
    }

    discardChanges = () => {
        this.setState({ errMsg: {}, selected: this.initSelected, loadingForm: false });
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
        this.props.showForm();
    }

    editRecord = (record) => {
        
        this.setState({
            loadingForm: false,
            errMsg: this.initSelected,
            selected: { ...record, imgUpload:record.photo_ktp, id_operator: this.props.user.id_operator }
        });
        this.props.showForm(true);
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        this.setState({
            ...this.state,
            loadingForm: true,
        });
        errors.name = !this.state.selected.name ? "Name required" : '';
        errors.phone = !this.state.selected.phone ? "Phone required" : '';
        errors.kendaraan = !this.state.selected.kendaraan ? "Kendaraan required" : '';
        errors.no_pol = !this.state.selected.no_pol ? "No.Pol required" : '';
        errors.email = !this.state.selected.email ? "Email required" : '';
        errors.pass = !this.state.selected.pass ? "Password required" : '';
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

        if (this.state.selected.email) {
            if (!pattern.test(this.state.selected.email)) {
                errors.email = "Please enter valid email address";
            }
        }
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });

        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.state.selected);
        } else {
            console.error('Invalid Form')
        }

    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    handleDelete() {
        this.props.onDelete(this.state.selected)
    }

    render() {
        const { data } = this.props;
        const { selected, errMsg } = this.state;

        const columns = [
            {
                key: "no",
                text: "No.",
                width: 20,
                align: "center",
                sortable: false,
                cell: (row, index) => <div style={{ textAlign: "center" }}>{((this.state.page_number - 1) * this.state.per_page) + index + 1 + '.'}</div>,
                row: 0
            },
            {
                key: "name",
                text: "Name",
                align: "center",
                width: 180,
                sortable: true
            },
            {
                key: "email",
                text: "Email",
                align: "center",
                width: 220,
                sortable: true
            },
            {
                key: "phone",
                text: "Phone",
                align: "center",
                width: 150,
                sortable: true
            },
            {
                key: "kendaraan",
                text: "Kendaraan",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        <div>{record.kendaraan} - {record.no_pol}</div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                width: 140,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Fragment>
                                <button
                                    className="btn btn-xs btn-success"
                                    onClick={e => this.editRecord(record)}
                                    style={{ marginRight: '5px' }}>
                                    <i className="fa fa-edit"></i> Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-xs"
                                    onClick={() => this.deleteRecord(record)}>
                                    <i className="fa fa-trash"></i> Delete
                                </button>
                            </Fragment>
                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id_driver',
            page_size: 10,
            length_menu: [10, 20, 50],
            show_filter: true,
            show_pagination: true,
            pagination: 'advance',
            button: {
                excel: false,
                print: false
            },
            language: {
                loading_text: "Please be patient while data loads..."
            }
        }
        const frmUser = <Form id="myForm">
            {this.props.errorPriority ? (<Message closable showIcon type="error" description={this.props.errorPriority} />) : ''}
            <Form.Row>
                <Form.Group as={Col} controlId="kendaraan">
                    <Form.Label>Kendaraan</Form.Label>
                    {errMsg.kendaraan ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.kendaraan}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="kendaraan"
                        type="text"
                        value={selected.kendaraan}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Kendaraan" />
                </Form.Group>
                <Form.Group as={Col} controlId="no_pol">
                    <Form.Label>No.Pol</Form.Label>
                    {errMsg.no_pol ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.no_pol}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="no_pol"
                        type="text"
                        value={selected.no_pol}
                        onChange={this.handleChange.bind(this)}
                        placeholder="No.Pol" />
                </Form.Group>
            </Form.Row>

            <Form.Row>
                <Form.Group as={Col} controlId="nik">
                    <Form.Label>NIK</Form.Label>
                    {errMsg.nik ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.nik}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="nik"
                        type="text" pattern="[0-9]*"
                        onInput={this.handleChangeNumberOnlyNik.bind(this)}
                        value={selected.nik ? selected.nik : ''}
                        onChange={this.handleChangeNumberOnlyNik.bind(this)}
                        placeholder="NIK" />
                </Form.Group>
                <Form.Group as={Col} controlId="name">
                    <Form.Label>Name</Form.Label>
                    {errMsg.name ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.name}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="name"
                        type="text"
                        value={selected.name}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Name" />
                </Form.Group>
                <Form.Group as={Col} controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    {errMsg.phone ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.phone}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="phone"
                        type="text" pattern="[0-9]*"
                        onInput={this.handleChangeNumberOnly.bind(this)}
                        value={selected.phone}
                        onChange={this.handleChangeNumberOnly.bind(this)}
                        placeholder="Phone" />
                </Form.Group>

            </Form.Row>


            <Form.Row>
                <Form.Group as={Col} controlId="email">
                    <Form.Label>Email</Form.Label>
                    {errMsg.email ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.email}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="email"
                        type="text"
                        value={selected.email}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Email" />
                </Form.Group>
                <Form.Group as={Col} controlId="pass">
                    <Form.Label>Password</Form.Label>
                    {errMsg.pass ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.pass}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="pass"
                        type="text"
                        value={selected.pass}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Password" />
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} controlId="photo_ktp">
                    <Form.Label>Photo KTP</Form.Label>{errMsg.photo_ktp ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.photo_ktp}</span>) : null}
                    <Form.File size="sm" name="photo_ktp" setfieldvalue={selected.photo_ktp && selected.photo_ktp} onChange={this.handleChange.bind(this)} />
                </Form.Group>
                {selected.imgUpload ? (<Form.Group as={Col} controlId="imagePreview" style={{ marginBottom: 0 }}>
                    <Figure>
                        <Figure.Image
                            thumbnail
                            width={130}
                            height={100}
                            alt=""
                            src={selected.imgUpload}
                        />
                    </Figure>
                </Form.Group>) : ''}
            </Form.Row>

        </Form>;

        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Drivers</h1>
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
                                    <div className="card-header card-header-content">
                                        <AppButton
                                            isLoading={this.props.isLoading}
                                            theme="info"
                                            onClick={this.discardChanges}
                                            icon='add'
                                        >
                                            Add
                                        </AppButton>

                                    </div>
                                    <div className="card-body">
                                        {data ? (
                                            <ReactDatatable
                                                config={config}
                                                records={data}
                                                columns={columns}
                                                dynamic={true}
                                                onChange={this.tableChangeHandler}
                                                loading={this.props.isLoading}
                                                total_record={this.props.totalData}
                                            />
                                        ) : (<p>No Data ...</p>)}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <AppModal
                    show={this.props.showFormAdd}
                    form={frmUser}
                    size="sm"
                    backdrop={false}
                    keyboard={false}
                    title="Add/Edit Drivers"
                    titleButton="Save change"
                    themeButton="success"
                    handleClose={this.handleClose}
                    isLoading={this.props.isAddLoading ? this.props.isAddLoading : this.state.loadingForm}
                    formSubmit={this.handleSubmit.bind(this)}
                ></AppModal>
                <AppModal
                    show={this.props.showFormDelete}
                    size="xs"
                    form={contentDelete}
                    handleClose={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete Drivers"
                    titleButton="Delete Drivers"
                    themeButton="danger"
                    isLoading={this.props.isAddLoading}
                    formSubmit={this.handleDelete.bind(this)}
                ></AppModal>
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
    data: state.drivers.data || [],
    isError: state.drivers.isError,
    isLoading: state.drivers.isLoading,
    isAddLoading: state.drivers.isAddLoading,
    showFormAdd: state.drivers.showFormAdd,
    errorPriority: state.drivers.errorPriority || null,
    contentMsg: state.drivers.contentMsg || null,
    showFormSuccess: state.drivers.showFormSuccess,
    showFormDelete: state.drivers.showFormDelete,
    tipeSWAL: state.drivers.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        },
        showForm: () => {
            dispatch(addForm());
        },
        showConfirmDel: (data) => {
            dispatch(confirmDel(data));
        },
        onAdd: (param) => {
            console.log(param);
            dispatch(addData(param));
        },
        onDelete: (param) => {
            dispatch(deleteData(param));
        },
        closeModal: () => {
            dispatch(closeForm());
        },
        resetError: () => {
            dispatch(clearError());
        },
        closeSwal: () => {
            dispatch(closeForm());
            const queryString = {
                sort_order: "ASC",
                sort_column: "name",
                per_page: 10,
            }
            dispatch(fetchData(queryString));
        },
        closeSwalError: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Drivers);