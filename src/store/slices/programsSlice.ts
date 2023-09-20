import { PayloadAction, createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { I_ProgramsState } from "../../interfaces/store.interface";
import { I_Program } from "../../interfaces/programs.interface";
import { I_JSONObject } from "../../interfaces/generic.interface";
import { GET_PROGRAMS_LIST } from "../../services/endPointsService";
import { AXIOS_REQUEST } from "../../services/axiosService";

const name = "programs";

const initialState = (): I_ProgramsState => ({
    list: null,
    needRefreshList: false,
    selected: null,
    filter: null,
    withActionInProgress: []
})

export const getProgramsList = createAsyncThunk(`${name}/getProgramsList`, async (id_program:number | undefined) => {
    const list: I_Program[] = await AXIOS_REQUEST(GET_PROGRAMS_LIST).then(r => r.data)

    return {
        list,
        selected: list.find(p => p.id_prog === id_program) || null
    }
})


const programsSlice = createSlice({
    name,
    initialState,
    reducers: {
        setProgramsList: (state, action: PayloadAction<Array<I_Program> | null>) => {
            state.list = action.payload;
            state.needRefreshList = false
        },
        selectProgram: (state, action: PayloadAction<I_Program | null>) => {
            state.selected = action.payload
        },
        setNeedRefreshList: (state, action: PayloadAction<boolean>) => {
            state.needRefreshList = action.payload
        },
        setFilterProgramParams: (state, action: PayloadAction<I_JSONObject>) => {
            state.filter = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProgramsList.fulfilled, (state, action) => {
            state.list = action.payload.list;
            state.selected = action.payload.selected;
        });
    }
})

export default programsSlice.reducer;

export const {
    selectProgram,
    setNeedRefreshList,
    setProgramsList,
    setFilterProgramParams
} = programsSlice.actions;
