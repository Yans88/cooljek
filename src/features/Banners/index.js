import React, { Component, Fragment } from 'react'
import { Figure, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchData, addForm, addData, clearError, confirmDel, closeForm, deleteData } from './bannerSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';

class Banners extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            id_banner: '',
            priority_number: '',
            img: '',
            id_operator: '',
            imgUpload: ''
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "priority_number",
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
        const number = (evt.target.validity.valid) ? evt.target.value : this.state.selected.priority_number;
        if (evt.target.validity.valid) {
            this.setState({ loadingForm: false, errMsg: { ...this.state.errMsg, priority_number: "" } });
            this.props.resetError();
        }
        this.setState({ selected: { ...this.state.selected, priority_number: number } });
    }

    handleChange(event) {
        const { name, value } = event.target
        var val = value;
        this.setState({ errMsg: this.initSelected });
        this.props.resetError();
        if (event.target.name === "img") {
            val = event.target.files[0];
            this.setState({ selected: { ...this.state.selected, imgUpload: "", img: "" } });
            if (!val) return;
            if (!val.name.match(/\.(jpg|jpeg|png)$/)) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, img: "Please select valid image(.jpg .jpeg .png)" } });

                //setLoading(true);
                return;
            }
            if (val.size > 2099200) {
                this.setState({ loadingForm: true, errMsg: { ...this.state.errMsg, img: "File size over 2MB" } });

                //setLoading(true);
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(val);
            reader.onloadend = () => {
                this.setState({ loadingForm: false, selected: { ...this.state.selected, imgUpload: reader.result, img: val } });
            };
        }
        this.setState({
            selected: {
                ...this.state.selected,
                [name]: val
            }
        });
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
            selected: { ...record, imgUpload: record.img }
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
        errors.priority_number = !this.state.selected.priority_number ? "Priority Number required" : '';
        if (this.state.selected.img) {
            var fileSize = this.state.selected.img.size;
            if (fileSize > 2099200) { // satuan bytes 2099200 => 2MB
                errors.img = "File size over 2MB";
            }
        }
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });

        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.onAdd(this.state.selected);
        } else {
            console.error('Invalid Form')
        }
        // this.setState({
        //     ...this.state,
        //     loadingForm: false,
        // });
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
                key: "priority_number",
                text: "Priorty",
                width: 200,
                align: "center",
                sortable: true
            },
            {
                key: "img",
                text: "Image",
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Figure style={{ marginTop: ".3rem", marginBottom: 0 }}>
                                <Figure.Image
                                    thumbnail
                                    width={150}
                                    height={120}
                                    src={record.img}
                                />

                            </Figure></div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                width: 170,
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
            key_column: 'id_banner',
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
            <Form.Group controlId="priority_number">
                <Form.Label>Priority Number</Form.Label>
                {this.props.errorPriority ? (<span className="float-right text-error badge badge-danger">{this.props.errorPriority}
                </span>) : ''}
                {errMsg.priority_number ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.priority_number}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="priority_number"
                    type="text" pattern="[0-9]*"
                    onInput={this.handleChangeNumberOnly.bind(this)}
                    value={selected.priority_number}
                    onChange={this.handleChangeNumberOnly.bind(this)}
                    placeholder="Priority Number" />
            </Form.Group>
            <Form.Group controlId="image">
                <Form.Label>Image</Form.Label>{errMsg.img ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.img}</span>) : null}
                <Form.File size="sm" name="img" setfieldvalue={selected.img} onChange={this.handleChange.bind(this)} />
            </Form.Group>
            {selected.imgUpload ? (<Form.Group controlId="imagePreview" style={{ marginBottom: 0 }}>
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
        </Form>;

        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Banner</h1>
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
                    title="Add/Edit Banner"
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
                    title="Delete Banner"
                    titleButton="Delete Banner"
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
    data: state.banners.data || [],
    isError: state.banners.isError,
    isLoading: state.banners.isLoading,
    isAddLoading: state.banners.isAddLoading,
    showFormAdd: state.banners.showFormAdd,
    errorPriority: state.banners.errorPriority || null,
    contentMsg: state.banners.contentMsg || null,
    showFormSuccess: state.banners.showFormSuccess,
    showFormDelete: state.banners.showFormDelete,
    tipeSWAL: state.banners.tipeSWAL,
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
                sort_column: "priority_number",
                per_page: 10,
            }
            dispatch(fetchData(queryString));
        },
        closeSwalError: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Banners);