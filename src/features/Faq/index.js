import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData, clearError, confirmDel, closeForm, deleteData } from './faqSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';


class Faq extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            id_faq: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "question",
            keyword: '',
            page_number: 1,
            per_page: 10,
            tipeData: 1,
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
        }
    }

    componentDidMount() {
        sessionStorage.removeItem('idFAQ');
        sessionStorage.removeItem('tipe');
        sessionStorage.removeItem('idOP');
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
        var val = value;
        this.props.resetError();
        this.setState({
            selected: {
                ...this.state.selected,
                [name]: val
            },
            errMsg: {
                ...this.state.errMsg,
                [name]: val ? '' : this.state.errMsg[name]
            },
            loadingForm: false
        });
        if (!this.state.selected.id_operator) this.setState({ selected: { ...this.state.selected, id_operator: this.props.user.id_operator } });
    }

    discardChanges = async () => {
        await sessionStorage.setItem('tipe', 1);
        sessionStorage.removeItem('idFAQ');
        this.props.history.push('/add_faq');
    }

    editRecord = async (record) => {
        await sessionStorage.setItem('idFAQ', record.id_faq);
        await sessionStorage.setItem('idOP', this.props.user.id_operator);
        this.props.history.push('/add_faq');
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }



    handleDelete() {
        this.props.onDelete(this.state.selected)
    }

    render() {
        const { data } = this.props;
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
                key: "question",
                text: "Question",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        <div dangerouslySetInnerHTML={{ __html: record.question }} />
                    )
                },
            },
            {
                key: "answer",
                text: "Answer",
                align: "center",
                sortable: true,
                cell: record => {
                    return (
                        <div dangerouslySetInnerHTML={{ __html: record.answer }} />
                    )
                },
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
            key_column: 'id_faq',
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


        const contentDelete = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style="padding-bottom:20px;">Apakah anda yakin <br/>akan menghapus data ini ?</div>' }} />;
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">FAQ Members</h1>
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
                    show={this.props.showFormDelete}
                    size="xs"
                    form={contentDelete}
                    handleClose={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete"
                    titleButton="Delete"
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
    data: state.faq.data || [],    
    isError: state.faq.isError,
    isLoading: state.faq.isLoading,
    isAddLoading: state.faq.isAddLoading,
    errorPriority: state.faq.errorPriority || null,
    contentMsg: state.faq.contentMsg || null,
    showFormSuccess: state.faq.showFormSuccess,
    showFormDelete: state.faq.showFormDelete,
    tipeSWAL: state.faq.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        },
        showConfirmDel: (data) => {
            dispatch(confirmDel(data));
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
                tipeData: 1,
                sort_order: "ASC",
                sort_column: "question",
                per_page: 10,
            }
            dispatch(fetchData(queryString));
        },
        closeSwalError: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Faq);