import React from 'react';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';

const tokenLogin = process.env.REACT_APP_TOKEN_LOGIN;

const PublicRoute = ({children, isLoggedIn, ...rest}) => {
    const isAuthenticated = isLoggedIn || localStorage.getItem(tokenLogin);

    return (
        <Route
            {...rest}
            render={({location}) =>
                isAuthenticated ? (
                    <Redirect
                        to={{
                            pathname: '/',
                            state: {from: location}
                        }}
                    />
                ) : (
                    children
                )
            }
        />
    );
};

const mapStateToProps = (state) => ({
    isLoggedIn: state.main.isLoggedIn
});

export default connect(mapStateToProps)(PublicRoute);
