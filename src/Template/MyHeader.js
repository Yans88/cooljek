import React, { Component } from 'react'
import { Dropdown, Header, Icon, Nav, Navbar } from 'rsuite'
import { connect } from 'react-redux';
import { clickExpand, onLogout, setDefaultOpenKeys } from '../features/main/mainSlice'
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

class MyHeader extends Component {

    componentDidMount() {
        const location = window.location.href;
        const BaseName = location.substring(location.lastIndexOf("/") + 1);
        const defaultOpenKeys = BaseName === "setting" || BaseName === "users" ? "3" : "/";
        //this.props.onLoad(defaultOpenKeys);
    }

    handleToggle() {
        this.props.onClickExpand();
    }
    handleLogout() {
        this.props.logOut();
        <Redirect to="/login" />
    }
    render() {

        return (

            <Header>
                <Navbar appearance="inverse" className="my-navbar1">
                    <Navbar.Header>
                        <Link to='/' className="navbar-brand logo"><b>Cooljek</b></Link>
                    </Navbar.Header>
                    <Navbar.Body>
                        <Nav>
                            <Nav.Item icon={<Icon icon="bars" />} onClick={this.handleToggle.bind(this)} className="drawwer"></Nav.Item>
                        </Nav>

                        <Nav pullRight>

                            <Dropdown className="show dr-logout" icon={<Icon icon="user-o" size="lg" />} title={this.props.user.name ? (this.props.user.name) : ("Account")}>
                                <Dropdown.Item onClick={this.handleLogout.bind(this)} className="dropdown-menuu" icon={<Icon icon="sign-out" />}>Logout</Dropdown.Item>

                            </Dropdown>
                        </Nav>

                    </Navbar.Body>
                </Navbar>

            </Header>


        )
    }
}
const mapDispatchToPros = (dispatch) => {
    return {
        onClickExpand: () => {
            dispatch(clickExpand());
        },
        logOut: () => {
            dispatch(onLogout());
        },
        onLoad: (dt) => {
            dispatch(setDefaultOpenKeys(dt));
        }
    }
}
const mapStateToProps = (state) => ({
    user: state.main.currentUser
});
export default connect(mapStateToProps, mapDispatchToPros)(MyHeader);