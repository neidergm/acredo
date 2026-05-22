import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import { type I_ProcessState } from "../../interfaces/store.interface";
import { type I_Process } from "../../interfaces/process.interface";

const name = "process";

const initialState = (): I_ProcessState => ({
    selected: undefined,
});

const processSlice = createSlice({
    name,
    initialState,
    reducers: {
        selectProcess: (state, action: PayloadAction<I_Process | null | undefined>) => {
            state.selected = action.payload;
        },
    },
});

export default processSlice.reducer;

export const { selectProcess } = processSlice.actions;
