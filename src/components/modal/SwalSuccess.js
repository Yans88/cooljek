import React from 'react';
import SweetAlert from "react-bootstrap-sweetalert";


export const AppSwalSuccess = ({
    show,
    children,
    handleClose,
    title,
    type,
    textBody,
    formSubmit,
    titleButton,
    themeButton,
    ...otherProps
}) => {
    return (
        <SweetAlert
            {...otherProps}
            show={show}
            type={type}
            title={title}
            text={textBody}
            onConfirm={handleClose ? handleClose : false}
            onCancel={handleClose}
            onEscapeKey={handleClose}
            onOutsideClick={handleClose}
        />
    );
};

export const AppSwalConfirm = ({
    show,
    children,
    handleClose,
    title,
    type,
    textBody,
    formSubmit,
    titleButton,
    themeButton,
    ...otherProps
}) => {
    return (
        <SweetAlert
            {...otherProps}
            show={show}
            type={type}
            title={title !== null ? title : '-'}
            text={textBody}
            onConfirm={handleClose}
            onCancel={handleClose}
            onEscapeKey={handleClose}
            onOutsideClick={handleClose}
        />
    );
};
