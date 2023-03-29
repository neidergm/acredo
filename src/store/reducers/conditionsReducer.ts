import { I_AppAction, I_ConditionsState } from "../../interfaces/store.interface";
import { SELECTED_CONDITION_DATA, SELECT_CONDITION, SET_PHASES_CONDITIONS } from "../actions/conditionsActions";

let initialState: I_ConditionsState = {
    selectedData: {},
    phasesWithConditions: {},
    selected: null
}

const conditionsReducer = (state = initialState, action: I_AppAction): I_ConditionsState => {

    switch (action.type) {
        // case SET_FETCHED_CONDITION_DATA:
        //     let { fetchedConditionData } = state;
        //     fetchedConditionData[action.payload.id_process]?.[]
        //     return {
        //         ...state,
        //         fetchedConditionData: {
        //             ...state,
        //             ...action.payload
        //         }
        // };
        case SET_PHASES_CONDITIONS:
            return {
                ...state,
                phasesWithConditions: { ...state.phasesWithConditions, [action.payload.id_process]: action.payload.data }
            };

        case SELECT_CONDITION:
            return {
                ...state,
                selected: action.payload,
            };

        case SELECTED_CONDITION_DATA:
            return {
                ...state,
                selectedData: action.payload === null ? {} : { ...state.selectedData, ...action.payload }
            };

        default:
            return state;
    }
}

export default conditionsReducer;
