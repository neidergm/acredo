import { I_AppAction, I_DashboardState } from "../../interfaces/store.interface";
import { SET_PROCESS_FILTER, SET_PROCESS_INDICATORS, SET_PROCESS_LIST } from "../actions/dashboardActions";

const initialState: I_DashboardState = {
    processFilter: [],
    processIndicators: [],
    processList: []
}

const conditionsReducer = (state = initialState, action: I_AppAction): I_DashboardState => {

    switch (action.type) {

        case SET_PROCESS_LIST:
            return {
                ...state,
                processList: action.payload
            };

        default:
            return state;
    }
}

export default conditionsReducer;
