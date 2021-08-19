import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

const ProtectedRoute = ({ children, isLoggedIn, ...rest }) => {
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );

};

const mapStateToProps = (state) => ({
    isLoggedIn: state.main.isLoggedIn
});

export default connect(mapStateToProps)(ProtectedRoute);