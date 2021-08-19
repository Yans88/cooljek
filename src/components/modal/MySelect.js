import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const wait = () => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, 200);
    });
};

const customStyles = {
    valueContainer: (styles) => ({
        ...styles, padding: '0px 8px'
    }),
    indicatorsContainer: (styles) => ({
        ...styles, padding: '4px'
    }),
    indicatorSeparator: (styles) => ({
        ...styles, marginBottom: '4px', marginTop: '4px'
    }),
    dropdownIndicator: (styles) => ({
        ...styles, padding: '1px'
    }),
    clearIndicator: (styles) => ({
        ...styles, padding: '1px'
    }),
    control: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles, minHeight: 24, height: 30
    }),
    option: (styles) => ({
        ...styles,
        borderBottom: '1px dotted pink',
        paddingTop: 5, paddingBottom: 5
    }),
    noOptionsMessage: (styles) => ({
        ...styles,
        padding: 5,
    }),
    menuList: (styles) => ({
        ...styles,
        maxHeight: '113px'
    })
}

const customStylesMulti = {
    valueContainer: (styles) => ({
        ...styles, padding: '0px 8px'
    }),
    indicatorsContainer: (styles) => ({
        ...styles, padding: '4px'
    }),
    indicatorSeparator: (styles) => ({
        ...styles, marginBottom: '4px', marginTop: '4px'
    }),
    dropdownIndicator: (styles) => ({
        ...styles, padding: '1px'
    }),
    clearIndicator: (styles) => ({
        ...styles, padding: '1px'
    }),
    control: (styles) => ({
        // none of react-select's styles are passed to <Control />
        ...styles, minHeight: 24,
    }),
    option: (styles) => ({
        ...styles,
        borderBottom: '1px dotted pink',
        paddingTop: 5, paddingBottom: 5
    }),
    noOptionsMessage: (styles) => ({
        ...styles,
        padding: 5,
    }),
    menuList: (styles) => ({
        ...styles,
        maxHeight: '185px'
    })
}
export const SelectProducts = props => {
    const [loading, setLoading] = useState(true);

    const getAsyncData = (param) => {
        const url = process.env.REACT_APP_URL_API + "/product/?per_page=" + param.per_page + "&page_number=" + param.page_number + "&keyword=" + param.keyword
        return wait().then(() => {
            const urlFetch = fetch(url).then(res => res.json()).then(dt => dt);
            return urlFetch;
        });
    };

    const getData = (search, loadedOptions, { page }) => {
        let param = {
            per_page: 25,
            page_number: page,
            keyword: search
        }
        return getAsyncData(param).then(result => {
            setLoading(false);
            if (result.err_code === '00') {
                const ttlDataShow = param.page_number * param.per_page;
                return {
                    options: result.data,
                    hasMore: ttlDataShow < result.total_data ? true : false,
                    additional: {
                        page: page + 1
                    }
                }
            } else {

                return {
                    options: [{ value: 0, label: "No Option" }],
                    hasMore: false,
                    additional: {
                        page: page + 1
                    }
                }
            }

        });
    };

    return (
        <AsyncPaginate
            name="id_product"
            isDisabled={loading}
            loadOptions={getData} // function that executes HTTP request and returns array of options
            defaultOptions
            value={props.myVal || ''}
            onChange={props.onChange}
            placeholder={loading ? "Loading..." : "Select...."}
            styles={customStyles}
            additional={{
                page: 1
            }}
        // isDisabled={loading} // uncomment this to disable dropdown until options loaded
        />
    );
}

export const SelectAsyncc = props => {
    const [loading, setLoading] = useState(true);

    const getAsyncData = (param) => {
        const url = process.env.REACT_APP_URL_API + "/" + props.uri1 + "/?per_page=" + param.per_page + "&page_number=" + param.page_number + "&keyword=" + param.keyword
        return wait().then(() => {
            const urlFetch = fetch(url).then(res => res.json()).then(dt => dt);
            return urlFetch;
        });

    };

    const getDataa = (search, loadedOptions, { page }) => {
        let param = {
            per_page: 25,
            page_number: page,
            keyword: search
        }
        return getAsyncData(param).then(result => {
            setLoading(false);
            if (result.err_code === '00') {
                const ttlDataShow = param.page_number * param.per_page;
                return {
                    options: result.data,
                    hasMore: ttlDataShow < result.total_data ? true : false,
                    additional: {
                        page: page + 1
                    }
                }
            } else {
                return {
                    options: [{ value: 0, label: "No Option" }],
                    hasMore: false,
                    additional: {
                        page: page + 1
                    }
                }
            }

        });
    };

    return (
        <AsyncPaginate
            {...props}
            isDisabled={loading}
            loadOptions={getDataa} // function that executes HTTP request and returns array of options
            defaultOptions
            value={props.myVal || ''}
            onChange={props.onChange}
            placeholder={loading ? "Loading..." : "Select...."}
            styles={customStyles}
            additional={{
                page: 1
            }}
        // isDisabled={loading} // uncomment this to disable dropdown until options loaded
        />
    );
}

export const SelectData = props => {
    return (
        <Select
            onChange={props.onChange}
            options={props.getData || [{ value: 0, label: "Loading..." }]}
            placeholder={props.isLoading ? "No Option..." : "Select...."}
            isDisabled={props.isLoading}
            styles={customStyles}
            value={props.myVal || ''}
        />
    );
};

export const SelectProvMulti = props => {
    return (
        <Select
            onChange={props.onChange}
            isMulti
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={props.getData || [{ value: 0, label: "Loading..." }]}
            placeholder={props.isLoading ? "No Option..." : "Select...."}
            isDisabled={props.isLoading}
            styles={customStylesMulti}
            value={props.myVal || ''}
        />
    );
};
