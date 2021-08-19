import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchData = createAsyncThunk(
    'setting/get',
    async (param, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + '/master_data', param);
            let data = '';
            let _data = response;
            let res = {};
            if (response.status === 200) {
                let dataa = _data.data;
                data = dataa.data;
                if (dataa.err_code === '00') {
                    res = {
                        data: data
                    }
                    return res;
                } else {
                    res = {
                        err_msg: dataa.err_msg
                    }
                    return thunkAPI.rejectWithValue(res);
                }
            } else {

                return thunkAPI.rejectWithValue(_data);
            }
        } catch (e) {
            console.log('Error', e.response.data);
            thunkAPI.rejectWithValue(e.response.data);
        }
    }
);

export const addData = createAsyncThunk(
    'setting/storeData',
    async (param, thunkAPI) => {
        let res = {};

        try {
            const response = await axios.post(API_URL + '/upd_setting', param);
            //let data = '';
            let _data = response;
            if (response.status === 200) {
                let dataa = _data.data;
                //data = dataa.data;
                if (dataa.err_code === '00') {
                    return dataa;
                } else {
                    res = {
                        isAddLoading: false,
                        showFormSuccess: false,
                        showFormAdd: true,
                        err_msg: dataa.err_msg,
                        contentMsg: null,
                    }
                    return thunkAPI.rejectWithValue(res);
                }
            } else {
                res = {
                    isAddLoading: false,
                    showFormSuccess: true,
                    showFormAdd: false,
                    contentMsg: "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>",
                    err_msg: null
                }
                console.log('Error', _data);
                return thunkAPI.rejectWithValue(res);
            }
        } catch (e) {
            res = {
                isAddLoading: false,
                showFormSuccess: true,
                showFormAdd: false,
                contentMsg: "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>",
                err_msg: null
            }
            console.log('Error catch', e.response.data);
            return thunkAPI.rejectWithValue(res);
        }
    }
);



const initialState = {
    data: {},
    error: null,
    isLoading: false,
    isAddLoading: false,
    contentMsg: null,
    showFormSuccess: false,
    tipeSWAL: "success"
};


export const settingSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        clearError: (state) => {
            state.isAddLoading = false;
            state.errorPriority = null;
            return state;
        },
        closeForm: (state) => {
            state.showFormSuccess = false;
        },
        chgProps: (state, { payload }) => {
            state.data[payload.key] = payload.value;
        }
    },
    extraReducers: {
        [fetchData.fulfilled]: (state, { payload }) => {

            state.data = payload.data;
            state.isLoading = false;
            state.isError = false;
            //return state;
        },
        [fetchData.rejected]: (state, { payload }) => {
            //console.log('payload', payload);
            state.isLoading = false;
            state.isError = true;
            state.errorMessage = payload !== undefined ? payload.err_msg : null;
        },
        [fetchData.pending]: (state) => {
            state.isLoading = true;
        },
        [addData.fulfilled]: (state) => {
            state.isError = false;
            state.tipeSWAL = "success";
            state.showFormSuccess = true;
            state.showFormAdd = false;
            state.isAddLoading = false;
            state.contentMsg = "<div style='font-size:20px; text-align:center;'><strong>Success</strong>, Data berhasil disimpan</div>";
        },
        [addData.rejected]: (state, { payload }) => {
            console.log(payload);
            state.isAddLoading = payload !== undefined ? payload.isAddLoading : false;
            state.showFormSuccess = payload !== undefined ? payload.showFormSuccess : true;
            state.showFormAdd = payload !== undefined ? payload.showFormAdd : false;
            state.tipeSWAL = "error";
            state.contentMsg = payload !== undefined ? payload.contentMsg : "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>";
            state.isError = true;
            state.errorPriority = payload !== undefined ? payload.err_msg : null;
        },
        [addData.pending]: (state) => {
            state.isAddLoading = true;
        },

    }
})

export const { clearError, closeForm, chgProps } = settingSlice.actions;
export const userSelector = (state) => state.settings;
//export default mainSlice.reducer;