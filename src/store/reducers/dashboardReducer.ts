import { I_AppAction, I_DashboardState } from "../../interfaces/store.interface";
// import { SET_PROCESS_INDICATORS, SET_PROCESS_LIST_RESUME, SET_PROCESS_SELECTED_FILTER, SET_PROGRAMS_INDICATORS, SET_PROGRAMS_LIST_RESUME, SET_PROGRAMS_SELECTED_FILTER } from "../actions/dashboardActions";

const initialState: I_DashboardState = {
    processIndicators: null,
    processSelectedFilter: null,
    processList: {},
    programsIndicators: null,
    programsSelectedFilter: null,
    programsList: {},
}

const dashboardReducer = (state = initialState, action: I_AppAction): I_DashboardState => {

    switch (action.type) {
        // case SET_PROCESS_LIST_RESUME:
        //     return {
        //         ...state,
        //         processList: { ...state.processList, [action.payload.filter]: action.payload.process }
        //     };

        // case SET_PROCESS_INDICATORS:
        //     return {
        //         ...state,
        //         processIndicators: action.payload
        //     };

        // case SET_PROCESS_SELECTED_FILTER:
        //     return {
        //         ...state,
        //         processSelectedFilter: action.payload
        //     };

        // case SET_PROGRAMS_LIST_RESUME:
        //     return {
        //         ...state,
        //         programsList: { ...state.programsList, [action.payload.filter]: action.payload.programs }
        //     };

        // case SET_PROGRAMS_INDICATORS:
        //     return {
        //         ...state,
        //         programsIndicators: action.payload
        //     };

        // case SET_PROGRAMS_SELECTED_FILTER:
        //     return {
        //         ...state,
        //         programsSelectedFilter: action.payload
        //     };

        default:
            return state;
    }
}

export default dashboardReducer;
