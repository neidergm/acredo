import { I_Action, I_ProcessState } from "../../interfaces/store.interface";
import { SET_PROCESS_LIST } from "../actions/processActions";

let initialState: I_ProcessState = {
    list: null
}

const userReducer = (state = initialState, action: I_Action): I_ProcessState => {
    switch (action.type) {
        case SET_PROCESS_LIST:
            // localStorage.clear();
            return {
                ...state,
                list: action.payload
            };

        default:
            return state;
    }
}

export default userReducer;
