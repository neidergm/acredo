import { I_Action, I_UserState } from '../../interfaces/store.interface';
import localStorageService from '../../services/localStorageService';
import { LOGOUT, SET_UNAUTHORIZED, SET_USERINFO } from '../actions/userActions';

let initialState: I_UserState = {
    userInfo: localStorageService.getItem("user"),
    unauthorized: "",
}

const userReducer = (state = initialState, action: I_Action): I_UserState => {
    switch (action.type) {
        case SET_UNAUTHORIZED:
            // localStorage.clear();
            return {
                ...state,
                unauthorized: action.payload || "",
                userInfo: null
            };
        case LOGOUT:
            return {
                ...state,
                unauthorized: "",
                userInfo: null
            };

        case SET_USERINFO:
            return {
                ...state,
                unauthorized: "",
                userInfo: action.payload
            };

        default:
            return state;
    }
}

export default userReducer;
