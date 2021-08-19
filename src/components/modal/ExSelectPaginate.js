import React, { useState } from "react";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { AsyncPaginate } from "react-select-async-paginate";
import ProductService from '../../products/ProductService'

const wait = () => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            resolve();
        }, 400);
    });
};

const customStyles = {
    option: (style) => ({
        ...style,
        borderBottom: '1px dotted pink',
        paddingTop: 5, paddingBottom: 5
    }),
    control: (style) => ({
        // none of react-select's styles are passed to <Control />
        ...style,
        height: 33,
        minHeight: 24
    }),
    singleValue: (style) => ({
        ...style,
        paddingTop: 0
    }),
    dropdownIndicator: (style) => ({
        ...style,
        padding: 0,
        paddingLeft: 4, paddingRight: 4
    }),
    indicatorsContainer: (style) => ({
        ...style,
        padding: 0,
        paddingLeft: 4
    }),
    indicatorSeparator: (style) => ({
        ...style,
        marginTop: 4, marginBottom: 4
    })
}


// MyAsyncSelect loads options on render with loading message in the dropdown
export const MyAsyncSelect = props => {
    return (
        <AsyncSelect
            loadOptions={props.getAsyncData} // function that executes HTTP request and returns array of options
            placeholder={"Select...."}
            defaultOptions // load on render
        // defaultOptions={[id: 0, label: "Loading..."]} // uncomment this to load on input change
        />
    );
};

export const MySelectLoading = props => {
    const [loading, setLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);

    const handleFocus = () => {
        if (!props.options && !hasLoaded) {
            setLoading(true);
            setHasLoaded(true);
            return props.getData().then(() => setLoading(false));
        }
    };

    return (
        <Select
            onFocus={handleFocus}
            options={props.options || [{ value: 0, label: "Loading..." }]}
            placeholder={loading ? "Loading options..." : "Select...."}
            isDisabled={loading}
        />
    );
};

// MyAsyncSelectLoading loads options on render with loading message in the text box
export const MyAsyncSelectLoading = props => {
    const [loading, setLoading] = useState(true);
    //process.env.REACT_APP_URL_API +"/product/?per_page=" + param.per_page + "&page_number=" + param.page_number + "&keyword=" + param.keyword

    const getAsyncData = (param) => {
        return wait().then(() => {
            return ProductService.getData(param, 'GET_PRODUCT')
                .then(todos => {
                    console.log(todos);
                    return todos
                        .map(todo => ({ value: todo.id_product, label: todo.product_name }));

                });
        });
    };

    const getData = (search, loadedOptions, { page }) => {
        let param = {
            per_page: 10,
            page_number: page,
            keyword: search
        }
        return getAsyncData(param).then(result => {
            setLoading(false);
            return {
                options: result,
                hasMore: true,
                additional: {
                    page: page + 1
                }
            }
        });
    };

    return (
        <AsyncPaginate
            loadOptions={getData} // function that executes HTTP request and returns array of options
            defaultOptions
            placeholder={loading ? "Loading..." : "Select...."}
            styles={customStyles}
            additional={{
                page: 1
            }}
        // isDisabled={loading} // uncomment this to disable dropdown until options loaded
        />
    );
};

