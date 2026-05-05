import { type PayloadAction, createAction, createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import localStorageService from "../../services/localStorageService";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { LOGIN } from "../../services/endPointsService";
import { type I_UserState } from "../../interfaces/store.interface";
import { type I_User } from "../../interfaces/user.interface";

export type T_LoginData = {
    correo: string,
    onetoken: string,
    confia: number,
    profilePicture: string
}

const name = "user";

const initialState = (): I_UserState => ({
    userInfo: localStorageService.getItem("user"),
    unauthorized: false,
})

export const login = createAsyncThunk(`${name}/login`, async (credential: string, { rejectWithValue }) => {
    const data = { token: credential, confia: 0 }

    const resp = await AXIOS_REQUEST(LOGIN, "post", data).catch(({ response }) => ({ ...response.data, error: true }))

    if (!resp || !(resp?.rpt)) return rejectWithValue("Parece que no tiene permisos para ingresar");

    const user = resp.rpt.data;

    localStorageService.setItems({
        "user": JSON.stringify(user),
        "token": resp.token
    });

    return user;
});

export const logout = createAction(`${name}/logout`)

export const setUnauthorized = createAction<string | undefined | false | null>(`${name}/setUnauthorized`)

const userSlice = createSlice({
    name,
    initialState,
    reducers: {
        setUserInfo: (state, action: PayloadAction<I_User>) => {
            state.userInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.fulfilled, (state, action) => {
            const user  = action.payload;
            state.userInfo = user;
            state.unauthorized = false;
        });
        builder.addCase(login.rejected, (state) => {
            state.unauthorized = "Parece que no tiene permisos para ingresar";
        })
        builder.addCase(setUnauthorized, (state, action) => {
            state.unauthorized = action.payload;
            state.userInfo = null;
        })
    },
})

export default userSlice.reducer;

export const {
    setUserInfo
} = userSlice.actions;
