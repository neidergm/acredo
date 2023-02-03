import { I_Action, I_ConditionsState } from "../../interfaces/store.interface";
import { SET_CONDITIONS, SET_CONDITION_DETAILS } from "../actions/conditionsActions";

let initialState: I_ConditionsState = {
    list: {},
    details: {}
}

const conditionsReducer = (state = initialState, action: I_Action): I_ConditionsState => {

    switch (action.type) {
        case SET_CONDITIONS:
            return {
                ...state,
                list: { ...state.list, ...action.payload }
            };

        case SET_CONDITION_DETAILS:
            return {
                ...state,
                details: { ...state.details, ...action.payload }
            };

        default:
            return state;
    }
}

export default conditionsReducer;
