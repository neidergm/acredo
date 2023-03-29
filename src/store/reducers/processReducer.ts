import { I_AppAction, I_ProcessState } from "../../interfaces/store.interface";
import { SET_PROCESS_LIST, SELECT_PROCESS } from "../actions/processActions";

let initialState: I_ProcessState = {
    list: null,
    selected: null
}

const userReducer = (state = initialState, action: I_AppAction): I_ProcessState => {
    switch (action.type) {
        case SET_PROCESS_LIST:
            return {
                ...state,
                list: action.payload
            };
        case SELECT_PROCESS:
            return {
                ...state,
                selected: action.payload
            };

        default:
            return state;
    }
}

export default userReducer;
