import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchData = createAsyncThunk(
    'members/get',
    async (param, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + '/members', param);
            let data = '';
            let _data = response;
            let res = {};
            if (response.status === 200) {
                let dataa = _data.data;
                data = dataa.data;
                if (dataa.err_code === '00') {
                    res = {
                        data: data,
                        totalData: dataa.total_data
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

export const setStatus = createAsyncThunk(
    'members/setStatus',
    async (param, thunkAPI) => {
        let res = {};

        try {
            const response = await axios.post(API_URL + '/set_stts_member', param);
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
                        showFormConfirm: true,
                        err_msg: dataa.err_msg,
                        contentMsg: null,
                    }
                    return thunkAPI.rejectWithValue(res);
                }
            } else {
                res = {
                    isAddLoading: false,
                    showFormSuccess: true,
                    showFormConfirm: false,
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
                showFormConfirm: false,
                contentMsg: "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>",
                err_msg: null
            }
            console.log('Error catch', e.response.data);
            return thunkAPI.rejectWithValue(res);
        }
    }
);

const initialState = {
    data: [],
    totalData: 0,
    isError: false,
    isLoading: false,
    isAddLoading: false,
    showFormSuccess: false,
    tipeSWAL: "success",
    contentMsg : null,
    dt: {
        id_operator: 0,
        id_member: 0,
        status: 0,
        showFormConfirm: false,
        contentConfirm: null,
    }
};

export const membersSlice = createSlice({
    name: 'members',
    initialState,
    reducers: {
        clearError: (state) => {
            state.isLoading = false;
            state.errorPriority = null;
            return state;
        },
        showConfirm: (state, { payload }) => {
            state.dt = payload;
            state.errorPriority = null;
            state.showFormSuccess = false;
        },
        closeForm: (state) => {
            state.dt = initialState.dt;
            state.errorPriority = null;
            state.showFormSuccess = false;
        },
    },
    extraReducers: {
        [fetchData.fulfilled]: (state, { payload }) => {
            state.totalData = payload.totalData;
            state.data = payload.data;
            state.isLoading = false;
            state.isError = false;
            state.contentMsg = null;
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
        [setStatus.fulfilled]: (state) => {
            state.isError = false;
            state.tipeSWAL = "success";
            state.showFormSuccess = true;
            state.dt.showFormConfirm = false;
            state.isAddLoading = false;
            state.contentMsg = "<div style='font-size:20px; text-align:center;'><strong>Success</strong>, Data berhasil diupdate</div>";
        },
        [setStatus.rejected]: (state, { payload }) => {
            console.log(payload);
            state.isAddLoading = payload !== undefined ? payload.isAddLoading : false;
            state.showFormSuccess = payload !== undefined ? payload.showFormSuccess : true;
            state.dt.showFormConfirm = payload !== undefined ? payload.showFormConfirm : false;
            state.tipeSWAL = "error";
            state.contentMsg = payload !== undefined ? payload.contentMsg : "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>";
            state.isError = true;
            state.errorPriority = payload !== undefined ? payload.err_msg : null;
        },
        [setStatus.pending]: (state) => {
            state.isAddLoading = true;
        },
    }
})

export const { clearError, showConfirm, closeForm } = membersSlice.actions;
export const userSelector = (state) => state.members;
//export default mainSlice.reducer;