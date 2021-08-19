import React, { Component, Fragment } from 'react'
import { Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchData, addForm, addData, clearError, confirmDel, closeForm, deleteData } from './usersSlice'
import { fetchData as fetchDataLevel } from '../Level/levelSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';

class Users extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            operator_by: '',
            name: '',
            pass: '',
            id_level: '',
            username: '',
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

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            selected: {
                ...this.state.selected,
                [name]: value
            }
        });
        this.setState({ errMsg: this.initSelected });
        this.props.resetError();
        if (!this.state.selected.operator_by) this.setState({ selected: { ...this.state.selected, operator_by: this.props.user.id_operator } });
    }

    discardChanges = () => {
        this.setState({ errMsg: {}, selected: this.initSelected, loadingForm: false });
        if (!this.state.selected.operator_by) this.setState({ selected: { ...this.state.selected, operator_by: this.props.user.id_operator } });
        this.props.showForm();
    }

    editRecord = (record) => {
        this.setState({
            loadingForm: false,
            errMsg: this.initSelected,
            selected: { ...record, operator_by: this.props.user.id_operator }
        });
        this.props.showForm(true);
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, operator_by: this.props.user.id_operator }
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
        errors.id_level = !this.state.selected.id_level ? "Level required" : '';
        errors.username = !this.state.selected.username ? "Username required" : '';
        errors.pass = !this.state.selected.pass ? "Password required" : '';
        if (!this.state.selected.operator_by) this.setState({ selected: { ...this.state.selected, operator_by: this.props.user.id_operator } });

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
        const { data, dataLevel } = this.props;
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
                sortable: true
            },
            {
                key: "username",
                text: "Username",
                align: "center",
                sortable: true
            },
            {
                key: "level_name",
                text: "Level",
                align: "center",
                sortable: true
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
            key_column: 'id_operator',
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
            <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                {this.props.errorPriority ? (<span className="float-right text-error badge badge-danger">{this.props.errorPriority}
                </span>) : ''}
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

            <Form.Group controlId="id_level">
                <Form.Label>Level</Form.Label>

                {errMsg.id_level ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.id_level}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    name="id_level"
                    as="select"
                    value={selected.id_level}
                    onChange={this.handleChange.bind(this)}>
                    <option value="">- Pilih Level -</option>
                    {dataLevel ? (
                        dataLevel.map(function (level) {
                            return <option
                                selected={level.id_level === selected.id_level ? true : false}
                                value={level.id_level}
                                key={level.id_level}>{level.level_name}
                            </option>
                        })

                    ) : ''}
                </Form.Control>
            </Form.Group>

            <Form.Row>
                <Form.Group as={Col} controlId="username">
                    <Form.Label>Username</Form.Label>
                    {errMsg.username ?
                        (<span className="float-right text-error badge badge-danger">{errMsg.username}
                        </span>) : ''}
                    <Form.Control
                        size="sm"
                        autoComplete="off"
                        name="username"
                        type="text"
                        value={selected.username}
                        onChange={this.handleChange.bind(this)}
                        placeholder="Username" />
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


        </Form>;

        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Users</h1>
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
                    size="xs"
                    backdrop={false}
                    keyboard={false}
                    title="Add/Edit Users"
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
                    title="Delete Users"
                    titleButton="Delete Users"
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
    data: state.usersAdm.data || [],
    dataLevel: state.level.data || [],
    isError: state.usersAdm.isError,
    isLoading: state.usersAdm.isLoading,
    isAddLoading: state.usersAdm.isAddLoading,
    showFormAdd: state.usersAdm.showFormAdd,
    errorPriority: state.usersAdm.errorPriority || null,
    contentMsg: state.usersAdm.contentMsg || null,
    showFormSuccess: state.usersAdm.showFormSuccess,
    showFormDelete: state.usersAdm.showFormDelete,
    tipeSWAL: state.usersAdm.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
            dispatch(fetchDataLevel());
        },
        showForm: () => {
            dispatch(addForm());
        },
        showConfirmDel: (data) => {
            dispatch(confirmDel(data));
        },
        onAdd: (param) => {
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
export default connect(mapStateToProps, mapDispatchToPros)(Users);