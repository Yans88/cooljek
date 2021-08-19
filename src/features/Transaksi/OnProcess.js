import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchData } from './transaksiSlice'
import ReactDatatable from '@ashvin27/react-datatable';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import "moment/locale/id";

class OnProcess extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sort_order: "ASC",
            sort_column: "id_transaksi",
            keyword: '',
            page_number: 1,
            per_page: 10,
            loadingForm: false,
            status: 2,
        }
    }

    componentDidMount() {
        this.props.onLoad(this.state);
    }

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

    rowClickedHandler = async (event, data, rowIndex) => {
        await sessionStorage.setItem('idTransKuu', data.id_transaksi);
        this.props.history.push("/trans_detail");
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
                key: "created_at",
                text: "Date",
                align: "center",
                sortable: true,
                width: 130,
                cell: record => {
                    return (moment(new Date(record.created_at)).format('DD-MM-YYYY HH:mm'))
                }
            },
            {
                key: "nama_member",
                text: "Member",
                align: "center",
                sortable: true
            },
            {
                key: "alamat_penjemputan",
                text: "Alamat Jemput",
                align: "center",
                sortable: true
            },
            {
                key: "phone_member",
                text: "Phone",
                align: "center",
                width: 120,
                sortable: true
            },
            {
                key: "total",
                text: "Total",
                width: 100,
                align: "center",
                sortable: true,
                cell: record => {
                    return (<div style={{ textAlign: "right" }}><Fragment>
                        <NumberFormat
                            value={record.total}
                            thousandSeparator={true}
                            decimalScale={2}
                            displayType={'text'}
                        />
                    </Fragment></div>)
                }
            }
        ];
        const config = {
            key_column: 'id_transaksi',
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


        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Transaksi</h1>
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
                                        <h1 className="card-title card-title-custom">On Process</h1>
                                    </div>
                                    <div className="card-body">
                                        {data ? (
                                            <ReactDatatable
                                                className="table table-striped table-hover table-bordered"
                                                config={config}
                                                records={data}
                                                columns={columns}
                                                dynamic={true}
                                                onChange={this.tableChangeHandler}
                                                loading={this.props.isLoading}
                                                total_record={this.props.totalData}
                                                onRowClicked={this.rowClickedHandler}
                                            />
                                        ) : (<p>No Data ...</p>)}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>


            </div>



        )
    }
}
const mapStateToProps = (state) => ({
    data: state.transaksi.data || [],
    isError: state.transaksi.isError,
    isLoading: state.transaksi.isLoading,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(OnProcess);