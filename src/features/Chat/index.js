import React, { Component, Fragment } from 'react'
import { List, Placeholder, Alert } from 'rsuite';
import { Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import moment from 'moment';
import "moment/locale/id";
import { fetchData, historyChat, storeData } from './chatSlice'
import noImg from '../../assets/noPhoto.jpg'
import AppButton from '../../components/button/Button';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cms: 1,
            id_operator: '',
            id_chat: '',
            nama_member: '',
            content: '',
            keyword: '',
            errMsg: { content: '' },
        }
    }

    componentDidMount() {
        this.props.onLoad(this.state);
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({
            behavior: "smooth",
            block: 'end',
            inline: 'nearest'
        });
    }

    chatDetail = async (record) => {
        this.setState({
            ...this.state,
            nama_member: record.nama,
            id_chat: record.id_chat,
            id_operator: this.props.user.id_operator
        })
        const param = { ...record, "isLoadingDetail": true }
        await this.props.detailChat(param);
        this.setState({ content: '' });
        this.scrollToBottom();
    }

    searchMember(event) {
        const { name, value } = event.target
        const lengthVal = event.target.value.length;
        this.setState({
            ...this.state,
            [name]: value,
        });
        if (lengthVal > 2 || lengthVal === 0) {
            const param = { keyword: event.target.value }
            this.props.onLoad(param);
        }
    }

    handleChange(event) {
        const { name, value } = event.target
        //var val = value;

        this.setState({
            ...this.state,
            [name]: value,
        });
        if (!this.state.id_operator) this.setState({ ...this.state, id_operator: this.props.user.id_operator });
    }

    handleSubmit() {
        var errors = this.state.errMsg;
        errors.content = !this.state.content ? "Silahkan ketik pesan yang akan dikirimkan" : '';
        this.setState({ errors });
        if (this.validateForm(this.state.errMsg)) {
            this.props.sendChat(this.state);
            this.setState({ content: '' });
            this.scrollToBottom();
        } else {
            console.error('Invalid Form')
            Alert.error("Silahkan ketik pesan yang akan dikirimkan", 5000);
        }
    }

    keyPress(e) {
        const lengthVal = e.target.value.length;
        if (e.keyCode === 13) {
            if (lengthVal > 0) {
                this.props.sendChat(this.state);
                this.setState({ content: '' });
                this.scrollToBottom();
            } else {
                Alert.error("Silahkan ketik pesan yang akan dikirimkan", 5000);
            }
        }
    }

    validateForm(errors) {
        let valid = true;
        Object.values(errors).forEach(
            (val) => val.length > 0 && (valid = false)
        );
        return valid;
    }

    render() {
        const { data, detailChats } = this.props;
        const { Paragraph } = Placeholder;

        return (

            <div className="content-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Chat</h1>
                            </div>{/* /.col */}

                        </div>{/* /.row */}
                    </div>{/* /.container-fluid */}
                </div>
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                {/* card start */}
                                <div className="card card-success direct-chat-primary shadow-lg" style={{ "height": "500px" }}>
                                    <div className="card-header card-header-content">
                                        <div className="row">
                                            <div className="col-4">
                                                <Form>
                                                    <Form.Group controlId="keyword" style={{ marginBottom: 0 }}>
                                                        <Form.Control
                                                            style={{ width: "95%" }}
                                                            size="sm"
                                                            autoComplete="off"
                                                            name="keyword"
                                                            type="text"
                                                            value={this.state.keyword}
                                                            onChange={this.searchMember.bind(this)}
                                                            placeholder="Search by name ..." />
                                                    </Form.Group>
                                                </Form>
                                            </div>
                                            <div className="col-8">
                                                <h5 className="m-0" style={{ color: '#000000', fontWeight: 500 }}>
                                                    {this.props.isLoadingDetail ? "Loading  . . ." : this.state.nama_member}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-4">

                                                <div className="inbox_chat">

                                                    <List hover>
                                                        {this.props.isLoading ? (
                                                            <Fragment>
                                                                <List.Item>
                                                                    <Paragraph graph="circle" active />
                                                                </List.Item>
                                                                <List.Item>
                                                                    <Paragraph graph="circle" active />
                                                                </List.Item>
                                                                <List.Item>
                                                                    <Paragraph graph="circle" active />
                                                                </List.Item>
                                                                <List.Item>
                                                                    <Paragraph graph="circle" active />
                                                                </List.Item>
                                                                <List.Item>
                                                                    <Paragraph graph="circle" active />
                                                                </List.Item>
                                                            </Fragment>
                                                        ) : ''}
                                                        {data.length > 0 && !this.props.isLoading ? (
                                                            data.map((dt, i) => (
                                                                <div key={i} onClick={e => this.chatDetail(dt)}>
                                                                    <List.Item>
                                                                        <img style={{ marginRight: 5 }} className="direct-chat-img" src={dt.photo ? dt.photo : noImg} alt={dt.nama} />
                                                                        <strong>{dt.nama}</strong>
                                                                        <span style={{ fontSize: 10 }} className="direct-chat-timestamp float-right">{moment(new Date(dt.updated_at)).format('L HH:mm')}</span>
                                                                        <p style={{ color: "#444", fontSize: 12 }}>{dt.content.length > 34 ? dt.content.substring(0, 35) + ' . . . . .' : dt.content}</p>
                                                                    </List.Item>
                                                                </div>
                                                            ))
                                                        ) :
                                                            (
                                                                <strong>{this.props.errorMessage ? this.props.errorMessage : "Data tidak ditemukan"}</strong>
                                                            )}


                                                    </List>
                                                </div>
                                            </div>
                                            <div className="col-8">

                                                <div className="direct-chat-messages">
                                                    {this.props.isLoadingDetail ? (
                                                        <Fragment>
                                                            <Paragraph rowHeight={15} rowMargin={10} rows={2} style={{ marginBottom: 15 }} graph="circle" active />
                                                            <Paragraph rowHeight={15} rowMargin={10} rows={2} style={{ marginBottom: 15 }} graph="circle" active />
                                                            <Paragraph rowHeight={15} rowMargin={10} rows={2} style={{ marginBottom: 15 }} graph="circle" active />
                                                            <Paragraph rowHeight={20} rowMargin={10} rows={2} style={{ marginBottom: 15 }} graph="circle" active />
                                                            <Paragraph rowHeight={20} rowMargin={10} rows={2} style={{ marginBottom: 15 }} graph="circle" active />

                                                        </Fragment>
                                                    ) : ''}
                                                    <Fragment>
                                                        {detailChats && !this.props.isLoadingDetail ? detailChats.map((dts, i) => (
                                                            <div key={i} className={dts.dari !== "Admin" ? "direct-chat-msg" : "direct-chat-msg right"}>
                                                                <div className="direct-chat-infos clearfix">
                                                                    <span className={dts.dari !== "Admin" ? "direct-chat-name float-left" : "direct-chat-name float-right"} >{dts.dari}</span>
                                                                    <span className={dts.dari !== "Admin" ? "direct-chat-timestamp float-right" : "direct-chat-timestamp float-left"}>{moment(new Date(dts.created_at)).format('ll HH:mm')}</span>
                                                                </div>
                                                                <img id={i} className="direct-chat-img" src={dts.photo_member ? dts.photo_member : noImg} alt={dts.dari} />
                                                                <div className="direct-chat-text">
                                                                    {dts.content}
                                                                </div>
                                                            </div>
                                                        )) : ''}

                                                    </Fragment>


                                                    <div ref={(el) => { this.messagesEnd = el; }} className={detailChats.length > 0 ? "color-fff" : ""} style={{ bottom: 0, position: "relative" }}>
                                                        {this.props.isLoadingDetail ? "Loading, Tunggu sebentar chat akan ditampilkan segera  . . ." : 'Silahkan pilih member untuk menampilkan chat  . . .'}
                                                    </div>


                                                </div>

                                                {detailChats.length > 0 ?
                                                    <Fragment>
                                                        <div className="input-group" style={{ bottom: 0, position: "relative", marginTop: 5 }}>
                                                            <input
                                                                type="text"
                                                                autoComplete="off"
                                                                name="content"
                                                                placeholder="Type Message ..."
                                                                onChange={this.handleChange.bind(this)}
                                                                onKeyDown={this.keyPress.bind(this)}
                                                                value={this.state.content}
                                                                className="form-control" />
                                                            <span className="input-group-append">
                                                                <AppButton
                                                                    onClick={this.handleSubmit.bind(this)}
                                                                    isLoading={this.props.isLoadingSend || this.props.isLoadingDetail}
                                                                    type="button"
                                                                    theme="primary">
                                                                    Send
                                                                </AppButton>

                                                            </span>
                                                        </div>
                                                    </Fragment> : null}


                                            </div>
                                        </div>

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
    data: state.chats.data || [],
    detailChats: state.chats.detailChat || [],
    isError: state.chats.isError,
    isLoading: state.chats.isLoading,
    isLoadingDetail: state.chats.isLoadingDetail,
    isLoadingSend: state.chats.isLoadingSend,
    errorMessage: state.chats.errorMessage,
    user: state.main.currentUser,
});
const mapDispatchToPros = (dispatch) => {
    return {
        onLoad: (param) => {
            dispatch(fetchData(param));
        },
        detailChat: (data) => {
            dispatch(historyChat(data));
        },
        sendChat: (data) => {
            dispatch(storeData(data));
        }

    }
}
export default connect(mapStateToProps, mapDispatchToPros)(Chat);