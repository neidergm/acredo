import { T_AppDispatch } from "..";
import { I_User } from "../../interfaces/user.interface";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { LOGIN as AUTH } from "../../services/endPointsService";
import localStorageService from "../../services/localStorageService";

// CONST ACTIONS
export const SET_UNAUTHORIZED = "SET_UNAUTHORIZED";
export const SET_USERINFO = "SET_USERINFO";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

// =============================================================
// ACTIONS
export const setUserInfo = (payload: I_User) => ({ type: SET_USERINFO, payload });
export const setUnauthorized = (payload: string) => {
    localStorageService.deleteItems(["user", "token"]);
    return { type: SET_UNAUTHORIZED, payload }
};
export const logout = () => {
    localStorageService.deleteItems(["user", "token"]);
    return { type: LOGOUT }
};

export type T_LoginData = {
    correo: string,
    onetoken: string,
    confia: number,
    profilePicture: string
}

export const login = (credential: string) => {
    let data = { token: credential, confia: 0 }

    return (dispatch: T_AppDispatch) => {
        return AXIOS_REQUEST(AUTH, "post", data).then(resp => {
            if (!resp || !(resp?.rpt)) throw new Error();

            let user = resp.rpt.data;

            localStorageService.setItems({
                "user": JSON.stringify(user),
                "token": resp.token
            });
            dispatch(setUserInfo(user));
            return true;
        }).catch(err => {
            // if (err.message == 401) {
            //     dispatch(setUnauthorized("Parece que no tiene permisos para ingresar"))
            // }
            return null;
        })
    }
}

