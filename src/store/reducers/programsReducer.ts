import { I_AppAction, I_ProgramsState } from "../../interfaces/store.interface";
import { SET_PROGRAMS_LIST, SELECT_PROGRAM, SET_REFRESH_STATE } from "../actions/programsActions";

const initialState: I_ProgramsState = {
    list: null,
    needRefreshList: false,
    selected: null
}

const programReducer = (state = initialState, action: I_AppAction): I_ProgramsState => {
    switch (action.type) {
        case SET_PROGRAMS_LIST:
            return {
                ...state,
                list: action.payload,
                needRefreshList: false
            };
        case SELECT_PROGRAM:
            return {
                ...state,
                selected: action.payload
            };
        case SET_REFRESH_STATE:
            return {
                ...state,
                needRefreshList: action.payload
            };

        default:
            return state;
    }
}

export default programReducer;
