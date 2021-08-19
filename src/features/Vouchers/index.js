import React, { Component, Fragment } from 'react'
import { Badge, Figure } from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchData, showConfirmPublish, clearError, confirmDel, closeForm, deleteData, publishData } from './vouchersSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import AppModal from '../../components/modal/MyModal';
import AppButton from '../../components/button/Button';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';

import moment from 'moment';
import "moment/locale/id";
import NumberFormat from 'react-number-format';
import { BsCapslockFill } from "react-icons/bs"

class Vouchers extends Component {

    constructor(props) {
        super(props);
        this.initSelected = {
            id: '',
            id_operator: '',
        }
        this.state = {
            sort_order: "ASC",
            sort_column: "kode_voucher",
            keyword: '',
            page_number: 1,
            per_page: 10,
            is_cms: 1,
            selected: this.initSelected,
            errMsg: this.initSelected,
            loadingForm: false,
        }
    }

    componentDidMount() {
        sessionStorage.removeItem('idVoucherCooljek');
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

    discardChanges = async (record) => {
        if (record) await sessionStorage.setItem('idVoucherCooljek', record.id);
        this.props.history.push("add_voucher");
    }

    deleteRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmDel(true);
    }

    publishRecord = (record) => {
        this.setState({
            selected: { ...record, id_operator: this.props.user.id_operator }
        });
        this.props.showConfirmPublish(true);
    }

    handlePublish() {
        this.props.onPublish(this.state.selected)
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
                key: "title",
                text: "Title",
                align: "center",
                sortable: true,
                width: 180,
                cell: record => {
                    return (
                        <Fragment>
                            {record.title}<br />
                            Min. Pembayaran:{' '}
                            <NumberFormat
                                value={record.min_pembelian}
                                thousandSeparator={true}
                                decimalScale={2}
                                displayType={'text'}
                            />
                        </Fragment>
                    )
                }
            },
            {
                key: "start_date",
                text: "Periode",
                align: "center",
                sortable: true,
                width: 220,
                cell: record => {
                    return (<Fragment>
                        {moment(new Date(record.start_date)).format('DD MMMM YYYY')} - {moment(new Date(record.end_date)).format('DD MMMM YYYY')}
                    </Fragment>)
                }
            },
            {
                key: "maks_potongan",
                text: "Potongan",
                align: "center",
                sortable: false,
                cell: record => {
                    return (<Fragment>
                        {record.tipe_voucher === 1 && <NumberFormat
                            value={record.nilai_potongan}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />}
                        {record.tipe_voucher === 2 && <NumberFormat
                            value={record.nilai_potongan}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />}
                        {record.tipe_voucher === 2 && ('% - ')}
                        {record.tipe_voucher === 2 && <NumberFormat
                            value={record.maks_potongan}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />}
                        <br />
                        <div style={{fontSize:12}} dangerouslySetInnerHTML={{ __html: '<b>Deskripsi : </b>' + record.deskripsi }} />

                        {record.tipe_voucher === 1 && <Badge variant="success">IDR</Badge>}
                        {record.tipe_voucher === 2 && <Badge variant="info">Persentase(%)</Badge>}

                    </Fragment>)
                }
            },
            {
                key: "img",
                text: "Image",
                align: "center",
                width: 180,
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            <Figure>
                                <Figure.Image
                                    thumbnail
                                    width={150}
                                    height={120}
                                    alt={record.kode_voucher}
                                    src={record.img}
                                />
                                <Figure.Caption style={{ color: '#000000' }}>
                                    <strong>{record.kode_voucher}</strong>
                                </Figure.Caption>
                            </Figure></div>
                    )
                }
            },
            {
                key: "action",
                text: "Action",
                width: 90,
                align: "center",
                sortable: false,
                cell: record => {
                    return (
                        <div style={{ textAlign: "center" }}>
                            {
                                !record.publish_by ? (
                                    <Fragment>
                                        <button
                                            className="btn btn-xs btn-info"
                                            onClick={() => this.publishRecord(record)}
                                            style={{ marginBottom: '3px', width: 80 }}>
                                            <BsCapslockFill /> Publish
                                        </button>
                                        <button
                                            className="btn btn-xs btn-success"
                                            onClick={e => this.discardChanges(record)}
                                            style={{ marginBottom: '3px', width: 80 }}>
                                            <i className="fa fa-edit"></i> Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-xs"
                                            onClick={() => this.deleteRecord(record)}
                                            style={{ width: 80 }}>
                                            <i className="fa fa-trash"></i> Delete
                                        </button>

                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <Badge style={{ fontSize: 12, lineHeight: 1.4 }} variant="primary">Published <br /> {moment(new Date(record.publish_date)).format('DD-MM-YYYY')} <br /> {moment(new Date(record.publish_date)).format('HH:mm')}</Badge>

                                    </Fragment>
                                )
                            }


                        </div>
                    );
                }
            }
        ];
        const config = {
            key_column: 'id',
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
        const contentPublish = <div dangerouslySetInnerHTML={{ __html: '<div id="caption" style=padding-bottom:20px;">Apakah anda akan <br/>mempublish voucher ini ?</div>' }} />;
        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Vouchers</h1>
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
                    show={this.props.showFormPublish}
                    size="xs"
                    form={contentPublish}
                    handleClose={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Publish Voucher"
                    titleButton="Publish"
                    themeButton="success"
                    isLoading={this.props.isAddLoading}
                    formSubmit={this.handlePublish.bind(this)}
                ></AppModal>
                <AppModal
                    show={this.props.showFormDelete}
                    size="xs"
                    form={contentDelete}
                    handleClose={this.handleClose}
                    backdrop="static"
                    keyboard={false}
                    title="Delete Voucher"
                    titleButton="Delete Voucher"
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
    data: state.vouchers.data || [],
    isError: state.vouchers.isError,
    isLoading: state.vouchers.isLoading,
    showFormPublish: state.vouchers.showFormPublish,
    errorPriority: state.vouchers.errorPriority || null,
    contentMsg: state.vouchers.contentMsg || null,
    showFormSuccess: state.vouchers.showFormSuccess,
    showFormDelete: state.vouchers.showFormDelete,
    tipeSWAL: state.vouchers.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        },
        onPublish: (data) => {
            dispatch(publishData(data));
        },
        showConfirmDel: (data) => {
            dispatch(confirmDel(data));
        },
        showConfirmPublish: (data) => {
            dispatch(showConfirmPublish(data));
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
                sort_column: "kode_voucher",
                is_cms: 1,
                per_page: 10,
            }
            dispatch(fetchData(queryString));
        },
        closeSwalError: () => {
            dispatch(closeForm());
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Vouchers);