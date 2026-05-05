import { type PayloadAction, createAction, createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { CONDITION_DETAILS, PHASES_WITH_COND_BY_PROCESS, STAGES } from "../../services/endPointsService";
import { type I_ConditionsState } from "../../interfaces/store.interface";
import { type T_Phase, type T_PhasesWithConditions, type T_Stage } from "../../interfaces/phasesAndStages.interface";
import { type I_JSONObject } from "../../interfaces/generic.interface";
import { type I_Condition } from "../../interfaces/conditions.interface";

const name = "task";

const initialState = (): I_ConditionsState => ({
    selectedData: {},
    phasesWithConditions: {},
    selected: null
})

export const getContionData = createAsyncThunk(`${name}/getContionData`, async (id_cond: number) => {

    const resp: I_Condition[] = (await AXIOS_REQUEST(`${CONDITION_DETAILS}${id_cond}`).catch((err) => ({ ...err, error: true }))).data

    return { ...resp[0] };
});

export const getPhasesWithConditions = createAsyncThunk(`${name}/getPhasesWithConditions`, async (id_process: number) => {

    const resp: T_PhasesWithConditions[] = (await AXIOS_REQUEST(`${PHASES_WITH_COND_BY_PROCESS}${id_process}`)).data

    return {
        id_process,
        data: resp
    };
});

export const getPhasesAndStagesOfCondition = createAsyncThunk(`${name}/getPhasesAndStagesOfCondition`, async (id_cond: number) => {

    const resp = await AXIOS_REQUEST(`${STAGES}${id_cond}`).catch((err) => ({ ...err, error: true }))

    const ps = (resp.data as any[]).reduce((p, c, _idx) => {
        const stage: T_Stage = {
            name: c.nomb_etapa,
            id: c.id_etapa,
            actions: c.acciones,
            status: !(c.acciones) ? 0 : c.est_etapa,
            actions_completed: c.acciones?.reduce((p: number, c: I_JSONObject) => c.est_accion === 2 ? p += 1 : p, 0)
        }

        const phase = p[c.id_fase];

        if (phase) {
            phase.stages.push(stage);
            phase.stages_completed += stage.status;
        } else {
            p[c.id_fase] = {
                name: c.nomb_fase,
                id: c.id_fase,
                stages: [stage],
                stages_completed: stage.status
            }
        }
        return p;
    }, {});

    const all: T_Phase[] = Object.values(ps);
    const phase = all.find(i => !(i.stages_completed === i.stages?.length));
    const stage = phase?.stages?.find(i => i.status === 0);
    const action = stage?.actions?.find(i => i.est_accion === 1 || i.est_accion === 0);

    return {
        active: { phase, stage, action },
        phases: all
    }
});

export const setProcessPhasesWithConditions = createAction(`${name}/setProcessPhasesWithConditions`, (id_process: number, data: T_PhasesWithConditions[] | null) => {
    return {
        payload: { id_process, data }
    }
})

const taskSlice = createSlice({
    name,
    initialState,
    reducers: {
        selectCondition: (state, action: PayloadAction<I_Condition | null>) => {
            state.selected = action.payload;
        },
        setSelectedConditionData: (state, action: PayloadAction<any>) => {
            state.selectedData = action.payload === null ? {} : { ...state.selectedData, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setProcessPhasesWithConditions, (state, action) => {
            state.phasesWithConditions = { ...state.phasesWithConditions, [action.payload.id_process]: action.payload.data };
        });
        builder.addCase(getContionData.fulfilled, (state, action) => {
            state.selected = action.payload;
        });
        builder.addCase(getPhasesWithConditions.fulfilled, (state, action) => {
            state.phasesWithConditions = { ...state.phasesWithConditions, [action.payload.id_process]: action.payload.data };
        });
        builder.addCase(getPhasesAndStagesOfCondition.fulfilled, (state, action) => {
            state.selectedData = action.payload === null ? {} : { ...state.selectedData, ...action.payload };
        });
    },
})

export default taskSlice.reducer;

export const {
    selectCondition,
    setSelectedConditionData
} = taskSlice.actions;
