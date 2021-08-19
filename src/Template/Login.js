import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, userSelector, clearState } from '../features/main/mainSlice'
import Button from '../components/button/Button';

const Login = () => {
    const { isFetching, isSuccess, errorMessage } = useSelector(
        userSelector
    );
    const history = useHistory();
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(clearState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(clearState());
            history.push('/');
        }
    }, [isSuccess, dispatch, history]);
    const formik = useFormik({
        initialValues: {
            username: '',
            pass: ''
        },
        validationSchema: Yup.object({
            username: Yup.string()
                .required('Please enter username'),
            pass: Yup.string()
                .required('Please provide a password')
        }),
        onSubmit: (values) => {
            dispatch(loginUser(values));
        }
    });

    const hideAlert = () => { dispatch(clearState()) }
    document.getElementById('root').classList = 'hold-transition login-page';

    return (
        <div className="login-box">
            <div className="card card-outline card-primary">
                <div className="card-header text-center h1">
                    <b>COOLJEK</b>
                </div>
                <div className="card-body">

                    {errorMessage ? (
                        <div className="alert alert-danger alert-sm">
                            <button onClick={hideAlert} type="button" className="close" data-dismiss="alert" aria-hidden="true">×</button>
                            <span className="fw-semi-bold text-error-login">Error: {errorMessage}</span>
                        </div>
                    ) : (<p className='login-box-msg'>Sign in to start your session</p>)}

                    <form onSubmit={formik.handleSubmit}>
                        {formik.touched.username && formik.errors.username ? (
                            <span className="float-right text-error badge badge-danger">{formik.errors.username}</span>
                        ) : null}
                        <div className="input-group mb-3">
                            <input
                                autoFocus
                                autoComplete="off"
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                {...formik.getFieldProps('username')} />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-user" />
                                </div>
                            </div>

                        </div>

                        {formik.touched.pass &&
                            formik.errors.pass ? (
                            <span className="float-right text-error badge badge-danger">{formik.errors.pass}</span>
                        ) : null}
                        <div className="input-group mb-3">
                            <input
                                autoComplete="off"
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                {...formik.getFieldProps('pass')} />
                            <div className="input-group-append">
                                <div className="input-group-text">
                                    <span className="fas fa-lock" />
                                </div>
                            </div>
                        </div>

                        <div className="social-auth-links text-center mt-2 mb-3">
                            <Button
                                block
                                type="submit"
                                isLoading={isFetching}
                                icon="sign"
                                theme="primary"
                            >
                                Sign in
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
};

export default Login;