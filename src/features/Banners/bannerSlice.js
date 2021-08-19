import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchData = createAsyncThunk(
    'banner/get',
    async (param, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + '/banner', param);
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

export const addData = createAsyncThunk(
    'banner/storeData',
    async (param, thunkAPI) => {
        let res = {};

        const form = Object.keys(param).reduce((f, k) => {
            f.append(k, param[k]);
            return f;
        }, new FormData());
        try {
            const response = await axios.post(API_URL + '/simpan_banner', form);
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

export const deleteData = createAsyncThunk(
    'banner/delete',
    async (param, thunkAPI) => {
        let res = {};

        try {
            const response = await axios.post(API_URL + '/del_banner', param);
            let data = '';
            let _data = response;
            if (response.status === 200) {
                let dataa = _data.data;
                data = dataa.data;
                if (dataa.err_code === '00') {
                    return dataa;
                } else {
                    res = {
                        isAddLoading: false,
                        showFormSuccess: true,
                        showFormDelete: false,
                        contentMsg: "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>",
                        err_msg: dataa.err_msg
                    }
                    console.log('Error err_code', data);
                    return thunkAPI.rejectWithValue(res);
                }
            } else {
                res = {
                    isAddLoading: false,
                    showFormSuccess: true,
                    showFormDelete: false,
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
                showFormDelete: false,
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
    errorPriority: null,
    contentMsg: null,
    showFormAdd: false,
    showFormSuccess: false,
    showFormDelete: false,
    tipeSWAL: "success"
};


export const bannerSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {
        addForm: (state) => {
            state.isAddLoading = false;
            state.showFormAdd = true;
            state.errorPriority = null;
            return state;
        },
        clearError: (state) => {
            state.isAddLoading = false;
            state.errorPriority = null;
            return state;
        },
        closeForm: (state) => {
            state.showFormAdd = false;
            state.showFormDelete = false;
            state.errorPriority = null;
            state.showFormSuccess = false;
        },
        confirmDel: (state) => {
            state.isAddLoading = false;
            state.showFormDelete = true;
            state.errorPriority = false;
            return state;
        }
    },
    extraReducers: {
        [fetchData.fulfilled]: (state, { payload }) => {
            state.totalData = payload.totalData;
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
        [deleteData.fulfilled]: (state) => {
            state.showFormDelete = false;
            state.isError = false;
            state.tipeSWAL = "success";
            state.showFormSuccess = true;
            state.isAddLoading = false;
            state.contentMsg = "<div style='font-size:20px; text-align:center;'><strong>Success</strong>, Data berhasil dihapus</div>";
        },
        [deleteData.rejected]: (state, { payload }) => {
            state.isAddLoading = payload !== undefined ? payload.isAddLoading : false;
            state.showFormSuccess = payload !== undefined ? payload.showFormSuccess : true;
            state.showFormDelete = payload !== undefined ? payload.showFormDelete : false;
            state.tipeSWAL = "error";
            state.contentMsg = payload !== undefined ? payload.contentMsg : "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>";
            state.isError = true;
            state.errorPriority = payload !== undefined ? payload.err_msg : null;
        },
        [deleteData.pending]: (state) => {
            state.isAddLoading = true;
        },
    }
})

export const { addForm, clearError, confirmDel, closeForm } = bannerSlice.actions;
export const userSelector = (state) => state.banners;
//export default mainSlice.reducer;