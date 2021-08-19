import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_URL_API;

export const fetchData = createAsyncThunk(
    'chat/get_list',
    async (param, thunkAPI) => {
        try {
            const response = await axios.post(API_URL + '/chat', param);
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

export const historyChat = createAsyncThunk(
    'chat/history',
    async (param, thunkAPI) => {
        let res = {};
        try {
            const response = await axios.post(API_URL + '/history_chat', param);
            let data = '';
            let _data = response;
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

export const storeData = createAsyncThunk(
    'chat/chat_to_member',
    async (param, thunkAPI) => {
        let res = {};
        try {
            const response = await axios.post(API_URL + '/chat_to_member', param);
            let data = '';
            let _data = response;
            if (response.status === 200) {
                let dataa = _data.data;
                data = dataa.data;
                if (dataa.err_code === '00') {
                    return dataa;
                } else {
                    res = {
                        showFormSuccess: true,
                        contentMsg: "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>",
                        err_msg: dataa.err_msg
                    }
                    console.log('Error err_code', data);
                    return thunkAPI.rejectWithValue(res);
                }
            } else {
                res = {
                    showFormSuccess: true,
                    contentMsg: "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>",
                    err_msg: null
                }
                console.log('Error', _data);
                return thunkAPI.rejectWithValue(res);
            }
        } catch (e) {
            res = {
                showFormSuccess: true,
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
    detailChat: [],
    totalData: 0,
    totalDataDetail: 0,
    isError: false,
    isLoading: false,
    isLoadingSend: false,
    isLoadingDetail: false,
    errorPriority: null,
    contentMsg: null,
    showFormSuccess: false,
    tipeSWAL: "success"
};


export const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
       
    },
    extraReducers: {
        [fetchData.fulfilled]: (state, { payload }) => {
            state.totalData = payload.totalData;
            state.data = payload.data;            
            state.isLoading = false;
            state.isLoadingDetail = false;
            state.isError = false;
            //return state;
        },
        [fetchData.rejected]: (state, { payload }) => {
            //console.log('payload', payload);
            state.totalData = 0;
            state.data = []; 
            state.isLoading = false;
            state.isError = true;
            state.errorMessage = payload !== undefined ? payload.err_msg : null;
        },
        [fetchData.pending]: (state) => {
            state.isLoading = true;
        },
        [historyChat.fulfilled]: (state, { payload }) => {
            state.totalDataDetail = payload.totalData;
            state.detailChat = payload.data;
            state.isLoadingDetail = false;
            state.isError = false;
        },
        [historyChat.rejected]: (state) => {
            state.isLoadingDetail = false;
            state.isError = true;
            state.detailChat = [];
        },
        [historyChat.pending]: (state) => {
            state.isLoadingDetail = true;
            state.detailChat = [];
        },
        [storeData.fulfilled]: (state, { payload }) => {
            state.isLoadingSend = false;
            state.detailChat = [
                ...state.detailChat,
                payload.data
            ]
        },
        [storeData.rejected]: (state, { payload }) => {
            state.isLoadingSend = true;
            state.showFormSuccess = true;
            state.tipeSWAL = "error";
            state.contentMsg = payload !== undefined ? payload.contentMsg : "<div style='font-size:20px; text-align:center;'><strong>Failed</strong>, Something wrong</div>";
            state.isError = true;
        },
        [storeData.pending]: (state) => {
            state.isLoadingSend = true;
        },
    }
})

export const { addForm, clearError, confirmDel, closeForm } = chatSlice.actions;
export const userSelector = (state) => state.chats;