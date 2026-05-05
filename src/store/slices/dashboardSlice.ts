import { type PayloadAction, createAction, createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { AXIOS_REQUEST } from "../../services/axiosService";

import { type I_DashboardState } from "../../interfaces/store.interface";
import { type I_Process } from "../../interfaces/process.interface";
import { type I_ProcessIndicators, type T_ProgramsIndicators } from "../../interfaces/dashboard.interface";
import { type I_Program } from "../../interfaces/programs.interface";
import { GET_PROCESS_INDICATORS, GET_PROGRAMS_INDICATORS } from "../../services/endPointsService";

const name = "dashboard";

const initialState = (): I_DashboardState => ({
    processIndicators: null,
    processSelectedFilter: null,
    processList: {},
    programsIndicators: null,
    programsSelectedFilter: null,
    programsList: {},
})

// export const setProcessList = createAction(`${name}/setProcessList`, (filter: string, process: I_Process[]) => ({ payload: { filter, process } }))
// builder.addCase(setProcessList, (state, action) => {
//     state.processList = { ...state.processList, [action.payload.filter]: action.payload.process }
// })

export const getProcessIndicators = createAsyncThunk(`${name}/getProcessIndicators`, async (filterSelected: I_ProcessIndicators | undefined | null) => {
    const data: I_ProcessIndicators[] = await AXIOS_REQUEST(GET_PROCESS_INDICATORS).then(r => r.data)
    // .catch((err) => ({ ...err, error: true }));
    return { filterSelected, data };
})

export const getProgramsIndicators = createAsyncThunk(`${name}/getProgramsIndicators`, async (filterSelected: I_ProcessIndicators | undefined | null) => {
    const data: T_ProgramsIndicators[] = await AXIOS_REQUEST(GET_PROGRAMS_INDICATORS).then(r => r.data)
    // .catch((err) => ({ ...err, error: true }));
    return { filterSelected, data };
})

export const setProcessList = createAction(`${name}/setProcessList`, (filter: string, process: I_Process[]) => {
    return {
        payload: { filter, process }
    }
})
export const setProgramsList = createAction(`${name}/setProgramsList`, (filter: string, programs: I_Program[]) => {
    return {
        payload: { filter, programs }
    }
})


const dashboardSlice = createSlice({
    name,
    initialState,
    reducers: {
        setProcessIndicators: (state, action: PayloadAction<I_ProcessIndicators[]>) => {
            state.processIndicators = action.payload;
        },
        setProcessSelectedFilter: (state, action: PayloadAction<I_ProcessIndicators>) => {
            state.processSelectedFilter = action.payload;
        },
        setProgramsIndicators: (state, action: PayloadAction<T_ProgramsIndicators[]>) => {
            state.programsIndicators = action.payload;
        },
        setProgramsSelectedFilter: (state, action: PayloadAction<T_ProgramsIndicators>) => {
            state.programsSelectedFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setProcessList, (state, action) => {
            state.processList = { ...state.processList, [action.payload.filter]: action.payload.process };
        })
        builder.addCase(setProgramsList, (state, action) => {
            state.programsList = { ...state.programsList, [action.payload.filter]: action.payload.programs };
        })
        builder.addCase(getProcessIndicators.fulfilled, (state, action) => {
            if (!action.payload.filterSelected) {
                state.processSelectedFilter = action.payload.data[0];
            }
            state.processIndicators = action.payload.data;
        })
        builder.addCase(getProgramsIndicators.fulfilled, (state, action) => {
            if (!action.payload.filterSelected) {
                state.programsSelectedFilter = action.payload.data[0];
            }
            state.programsIndicators = action.payload.data;
        })
    },
})

export default dashboardSlice.reducer;

export const {
    setProcessIndicators,
    setProcessSelectedFilter,
    setProgramsIndicators,
    setProgramsSelectedFilter
} = dashboardSlice.actions;
