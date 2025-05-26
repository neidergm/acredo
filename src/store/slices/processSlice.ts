import { PayloadAction, createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { PROCESS_LIST } from "../../services/endPointsService";
import { I_ProcessState } from "../../interfaces/store.interface";
import { I_Process } from "../../interfaces/process.interface";

const name = "process";

const initialState = (): I_ProcessState => ({
    list: null,
    selected: undefined
})

export const getProcessList = createAsyncThunk(`${name}/getProcessList`, async (data: { id_process?: number, status?: string } | undefined) => {

    const { id_process, status } = data || {}
    let url = PROCESS_LIST;

    if (status) url += `/all/${status}`;

    const list: I_Process[] = await AXIOS_REQUEST(url).then(r => r.data)
    return {
        selected: id_process ? list.find(p => p.id_conv === id_process) : null,
        list
    }
});


const processSlice = createSlice({
    name,
    initialState,
    reducers: {
        setProcessList: (state, action: PayloadAction<Array<I_Process> | null>) => {
            state.list = action.payload;
        },
        selectProcess: (state, action: PayloadAction<I_Process | null | undefined>) => {
            state.selected = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProcessList.pending, (state) => {
            state.selected = undefined;
        });
        builder.addCase(getProcessList.fulfilled, (state, action) => {
            state.list = action.payload.list;
            state.selected = action.payload.selected || null;
        });
    },
})

export default processSlice.reducer;

export const {
    selectProcess,
    setProcessList
} = processSlice.actions;
