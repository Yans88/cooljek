import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import { fetchDataDetail, setDriver, assignDriver, closeForm } from './transaksiSlice'
import NumberFormat from 'react-number-format';
import moment from 'moment';
import "moment/locale/id";
import { Button, Icon, Placeholder } from 'rsuite';
import { Form } from 'react-bootstrap';
import AppModal from '../../components/modal/MyModal';
import { SelectData } from '../../components/modal/MySelect';
import axios from 'axios';
import { AppSwalSuccess } from '../../components/modal/SwalSuccess';

class TransDetail extends Component {
    constructor(props) {
        super(props);
        this.initSelected = {
            operator_by: '',
            id_driver: '',
            id_operator: '',
            deviceID: '',
        }
        this.state = {
            isLoading: false,
            showSwalSuccess: false,
            errMsg: this.initSelected,
            id_operator: '',
            id_driver: '',
            driver_name: '',
            deviceID: '',
            id_transaksi: sessionStorage.getItem('idTransKuu'),
            selectOptions: null,
            isLoadingSelected: false
        }
        this.onchangeSelect = this.onchangeSelect.bind(this);
    }

    componentDidMount() {
        this.getData();
    }

    getData = () => {
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
        const selectedIdCNI = sessionStorage.getItem('idTransKuu');
        const queryString = { id_transaksi: selectedIdCNI }
        this.props.onLoad(queryString);
    };

    handleSubmit() {
        var errors = this.state.errMsg;
        errors.id_driver = !this.state.id_driver ? "Driver required" : '';
        errors.deviceID = !this.state.deviceID ? "Device ID required" : '';
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.assignDrivers(this.state);
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

    confirmDriver = () => {
        const param = { showFormDriver: true }
        this.getOptions();
        this.props.onSetDriver(param);
    }

    handleClose = () => {
        this.setState({
            ...this.state,
            id_driver: '',
            deviceID: '',
            errMsg: {
                id_driver: '',
                deviceID: ''
            }
        })
        const param = { showFormDriver: false }
        this.props.onSetDriver(param);
    };

    handleChange(event) {
        const { name, value } = event.target
        var val = value;
        this.setState({
            ...this.state,
            [name]: val
        });
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
    }

    async onchangeSelect(evt) {
        await this.setState({ ...this.state, id_driver: evt.value, driver_name: evt.label })
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
    };

    closeSwal = () => {
        this.props.closeSwal();
        this.getData();
    }

    async getOptions() {
        this.setState({ isLoadingSelected: true, id_driver: '', driver_name: '' })
        const param = { is_wh: 1 }
        const url = process.env.REACT_APP_URL_API + "/drivers"
        const res = await axios.post(url, param)
        const err_code = res.data.err_code
        if (err_code === '00') {
            const data = res.data.data
            const options = data.map(d => ({
                "value": d.id_driver,
                "label": d.name
            }))
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptions: options,
                    isLoadingSelected: false

                })
            }, 400);
        } else {
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    selectOptions: null,
                    isLoadingSelected: true

                })
            }, 400);

        }
    }

    render() {
        const { dtRes } = this.props;
        const { Paragraph } = Placeholder;
        const { errMsg } = this.state;

        const frmUser = <Form id="myForm" style={{ height: 180 }}>

            <Form.Group controlId="id_driver">
                <Form.Label>Driver</Form.Label>
                {this.props.errorPriority ? (<span className="float-right text-error badge badge-danger">{this.props.errorPriority}
                </span>) : ''}
                {errMsg.id_driver ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.id_driver}
                    </span>) : ''}
                <SelectData
                    myVal={this.state.id_driver ? ({ value: this.state.id_driver, label: this.state.driver_name }) : ''}
                    getData={this.state.selectOptions}
                    isLoading={this.state.isLoadingSelected}
                    onChange={this.onchangeSelect}
                />
            </Form.Group>

            <Form.Group controlId="category_name">
                <Form.Label>Device ID</Form.Label>
                {errMsg.deviceID ?
                    (<span className="float-right text-error badge badge-danger">{errMsg.deviceID}
                    </span>) : ''}
                <Form.Control
                    size="sm"
                    autoComplete="off"
                    name="deviceID"
                    type="text"
                    value={this.state.deviceID}
                    onChange={this.handleChange.bind(this)}
                    placeholder="Device ID" />
            </Form.Group>

        </Form>;
        return (
            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Transaksi Detail</h1>
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
                                        <table className="table table-condensed">

                                            <tbody>
                                                <tr>
                                                    <td style={{ "backgroundColor": "rgba(0,0,0,.1)", "fontWeight": "bold", "fontSize": "16px" }} colSpan="9" align="center">
                                                        Information </td>
                                                </tr>
                                                {this.props.isLoading ? (
                                                    <Fragment>
                                                        <tr><td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                        <tr><td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                        <tr><td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                        <tr><td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                        <tr><td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                        <tr><td colSpan="9"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                    </Fragment>
                                                ) : (
                                                    <Fragment>
                                                        <tr>
                                                            <td width="15%"><strong>Order ID</strong></td>
                                                            <td width="1%"><strong>:</strong></td>
                                                            <td width="20%">{dtRes.id_transaksi}</td>
                                                            <td width="8%"><strong>Name</strong></td>
                                                            <td width="1%"><strong>:</strong></td>
                                                            <td width="25%">{dtRes.nama_member}</td>
                                                            <td width="12%"><strong>Pengiriman</strong></td>
                                                            <td width="1%"><strong>:</strong></td>
                                                            <td width="20%">{dtRes.tipe_pengantaran === 1 ? 'Instant' : 'Sameday'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Status</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td><Fragment>
                                                                {dtRes.status === 0 && <span className="badge bg-warning">Waiting Payment</span>}
                                                                {dtRes.status === 1 && <span className="badge bg-info">Payment Complete</span>}
                                                                {(dtRes.status >= 2 && dtRes.status <= 5) && <span className="badge bg-warning">On Process</span>}
                                                                {dtRes.status === 6 && <span className="badge bg-success">Completed</span>}
                                                            </Fragment>
                                                            </td>
                                                            <td><strong>Email</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{dtRes.email}</td>
                                                            <td><strong>Order Date</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{dtRes.created_at ? moment(new Date(dtRes.created_at)).format('DD MMMM YYYY HH:mm') : '-'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Driver</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{dtRes.status === 1 ? (
                                                                <Button onClick={this.confirmDriver} size="xs" color="orange"><Icon icon="motorcycle" /> Set Driver</Button>
                                                            ) : (dtRes.driver_name ? dtRes.driver_name : '-')}</td>
                                                            <td><strong>Phone</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{dtRes.phone_member}</td>
                                                            <td><strong>Payment Date</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{dtRes.payment_date ? moment(new Date(dtRes.payment_date)).format('DD MMMM YYYY HH:mm') : '-'}</td>
                                                        </tr>

                                                        <tr>
                                                            <td><strong>Phone Driver</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{dtRes.driver_phone ? dtRes.driver_phone : '-'}</td>
                                                            <td><strong>Device ID</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{dtRes.deviceID ? dtRes.deviceID : '-'}</td>
                                                            <td><strong>Pickup Date</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td>{dtRes.pickup_date ? moment(new Date(dtRes.pickup_date)).format('DD MMMM YYYY HH:mm') : '-'}</td>

                                                        </tr>

                                                        <tr>
                                                            <td><strong>Note untuk driver</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td colSpan="7">{dtRes.note_utk_driver ? dtRes.note_utk_driver : '-'}</td>
                                                        </tr>
                                                        <tr>
                                                            <td><strong>Alamat Penjemputan Paket</strong></td>
                                                            <td><strong>:</strong></td>
                                                            <td colSpan="7">{dtRes.alamat_penjemputan ? dtRes.alamat_penjemputan : '-'}{dtRes.phone_pengirim ? ', ' + dtRes.phone_pengirim : ''}{'.(' + dtRes.titik_lat_penjemputan + ',' + dtRes.titik_long_penjemputan + ')'}</td>
                                                        </tr>
                                                    </Fragment>
                                                )}
                                                <tr>
                                                    <td style={{ "backgroundColor": "rgba(0,0,0,.08)", "fontWeight": "bold", "fontSize": "16px" }} colSpan="9" align="center">List Pengantaran Paket</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                        <br />
                                        <table className="table table-bordered" style={{ borderBottom: "none", borderLeft: "none" }}>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 40, textAlign: 'center' }}>No.</th>
                                                    <th style={{ width: 200, textAlign: 'center' }}>Tujuan</th>
                                                    <th style={{ width: 150, textAlign: 'center' }}>Kategory</th>
                                                    <th style={{ width: 150, textAlign: 'center' }}>Packaging</th>
                                                    <th style={{ width: 120, textAlign: 'center' }}>Ukuran</th>
                                                    <th style={{ width: 200, textAlign: 'center' }}>Deskripsi</th>
                                                    <th style={{ "textAlign": "center", width: 100 }}>Price Packaging</th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.props.isLoading ? (
                                                    <Fragment>
                                                        <tr><td colSpan="7"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                        <tr><td colSpan="7"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                        <tr><td colSpan="7"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td></tr>
                                                        <tr>
                                                            <td style={{ border: "none" }} colSpan="5"></td>
                                                            <td style={{ border: "none" }} colSpan="2" align="right"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ border: "none" }} colSpan="5"></td>
                                                            <td style={{ border: "none" }} colSpan="2" align="right"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ border: "none" }} colSpan="5"></td>
                                                            <td style={{ border: "none" }} colSpan="2" align="right"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ border: "none" }} colSpan="5"></td>
                                                            <td style={{ border: "none" }} colSpan="2" align="right"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td>
                                                        </tr>
                                                        <tr>
                                                            <td style={{ border: "none" }} colSpan="5"></td>
                                                            <td style={{ border: "none" }} colSpan="2" align="right"><Paragraph rowHeight={20} rowMargin={7} rows={1} active /></td>
                                                        </tr>
                                                    </Fragment>
                                                ) : (
                                                    <Fragment>
                                                        {dtRes.transaksi_detail ? dtRes.transaksi_detail.map((dt, i) => (

                                                            <tr key={i}>
                                                                <td align="center">{i + 1}.</td>
                                                                {dt.status === 1 ? (<td>{dt.penerima + ' - ' + dt.phone_penerima}<br />{dt.alamat_penerima + '. (' + dt.titik_lat_antar + ',' + dt.titik_lat_antar + ')'}<br /><span className="badge bg-info">Received date :{moment(new Date(dt.status_date)).format('DD MMMM YYYY HH:mm')}</span></td>) : (<td>{dt.penerima + ' - ' + dt.phone_penerima}<br />{dt.alamat_penerima + '. (' + dt.titik_lat_antar + ',' + dt.titik_lat_antar + ')'}</td>)}

                                                                <td>{dt.category_name}</td>
                                                                <td>{dt.ap_name}</td>
                                                                {dt.status === 1 ? (<td>{dt.ukuran_name}<br /><span className="badge bg-warning">Temperatur : {dt.last_temp}&#8451;</span></td>) : (<td>{dt.ukuran_name}</td>)}
                                                                <td>{dt.deskripsi}</td>
                                                                <td align="right">
                                                                    <NumberFormat
                                                                        value={dt.hrg_ap}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </td>
                                                            </tr>

                                                        ))

                                                            : (<tr><td colSpan="7">Data not found</td></tr>)}
                                                        <tr>
                                                            <td align="right" colSpan="6" style={{ border: "none" }}><strong>Total Packaging</strong></td>
                                                            <td align="right">
                                                                <NumberFormat
                                                                    value={dtRes.ttl_hrg_ap}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" colSpan="6" style={{ border: "none" }}><strong>Handling Fee</strong></td>
                                                            <td align="right">
                                                                <NumberFormat
                                                                    value={dtRes.ttl_handling_fee}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" colSpan="6" style={{ border: "none" }}>
                                                                <strong>Ongkos Antar({dtRes.total_jarak} Km x <NumberFormat
                                                                    value={dtRes.ongkir_perkm}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />)</strong>
                                                            </td>
                                                            <td align="right">
                                                                <NumberFormat
                                                                    value={dtRes.ongkos_antar}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" colSpan="6" style={{ border: "none", color: "red" }}>
                                                                <strong>Potongan Voucher</strong>
                                                            </td>
                                                            <td align="right" style={{ color: "red" }}>
                                                                <NumberFormat
                                                                    value={dtRes.potongan_voucher}
                                                                    thousandSeparator={true}
                                                                    decimalScale={2}
                                                                    displayType={'text'}
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td align="right" colSpan="6" style={{ border: "none" }}>
                                                                <strong>Total</strong>
                                                            </td>
                                                            <td align="right" style={{ "backgroundColor": "rgba(0,0,0,.04)" }}>
                                                                <strong>
                                                                    <NumberFormat
                                                                        value={dtRes.total}
                                                                        thousandSeparator={true}
                                                                        decimalScale={2}
                                                                        displayType={'text'}
                                                                    />
                                                                </strong>
                                                            </td>

                                                        </tr>
                                                    </Fragment>
                                                )}

                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <AppModal
                    show={this.props.showFormDriver}
                    form={frmUser}
                    size="xs"
                    backdrop={false}
                    keyboard={false}
                    title="Set Driver"
                    titleButton="Set Driver"
                    themeButton="success"
                    handleClose={this.handleClose}
                    isLoading={this.props.isAddLoading ? this.props.isAddLoading : this.state.isLoadingSelected}
                    formSubmit={this.handleSubmit.bind(this)}
                ></AppModal>

                {this.props.showFormSuccess ? (<AppSwalSuccess
                    show={this.props.showFormSuccess}
                    title={this.props.successMsg}
                    type="success"
                    handleClose={this.closeSwal} />) : ''}

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    dtRes: state.transaksi.dtRes || [],
    showFormDriver: state.transaksi.showFormDriver,
    isError: state.transaksi.isError,
    isLoading: state.transaksi.isLoading,
    isAddLoading: state.transaksi.isAddLoading,
    contentMsg: state.transaksi.contentMsg || null,
    showFormSuccess: state.transaksi.showFormSuccess,
    tipeSWAL: state.transaksi.tipeSWAL,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchDataDetail(param));
        },
        onSetDriver: (param) => {
            dispatch(setDriver(param));
        },
        assignDrivers: (param) => {
            dispatch(assignDriver(param));
        },
        closeSwal: () => {
            dispatch(closeForm());

        }
    }
}
export default connect(mapStateToProps, mapDispatchToPros)(TransDetail);