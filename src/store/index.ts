import { AnyAction, combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import { logout, setUnauthorized } from './slices/userSlice';

import { setOtherAxiosConfig, setTokenForAxiosRequest } from '../services/axiosService'
import localStorageService from '../services/localStorageService';
import userSlice from './slices/userSlice';
import taskSlice from './slices/taskSlice';
import dashboardSlice from './slices/dashboardSlice';
import notificationsSlice from './slices/notificationsSlice';
import loaderSlice, { close, open } from './slices/loaderSlice';
import programsSlice from './slices/programsSlice';
import processSlice from './slices/processSlice';

const slices = {
    user: userSlice,
    dashboard: dashboardSlice,
    programs: programsSlice,
    process: processSlice,
    conditions: taskSlice,
    notifications: notificationsSlice,
    loader: loaderSlice,
}

const combinedSlices = combineReducers(slices);

const reducer = (state: any, action: AnyAction) => {
    if (logout.match(action) || (setUnauthorized.match(action) && !!(action.payload))) {
        localStorageService.deleteItems(["user", "token"]);
        state = undefined;
    }
    return combinedSlices(state, action)
}

const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
        // serializableCheck: { ignoredActions: [open.type, close.type]}
    }),
});

export const startUserConfigurations = () => {

    setTokenForAxiosRequest(localStorageService.getItem("token"));

    setOtherAxiosConfig({
        validateStatus: (status: number) => {
            if (status === 401) {
                store.dispatch(setUnauthorized("Su sesión a expirado"));
            }
            return status >= 200 && status < 300; // default
        }
    });

    // try {
    //     const config = sessionStorageService.getItem("config");

    //     // if (!(config) || !(config?.expireAt) || config?.expireAt < new Date().getTime()) {
    //     if (!(Object.keys(config).length) || !(config?.expireAt) || config?.expireAt < new Date().getTime()) {
    //         throw new Error
    //     }
    // } catch (error) { store.dispatch(getConfig()) }
}

startUserConfigurations();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type T_AppState = ReturnType<typeof store.getState>
export type T_AppDispatch = typeof store.dispatch;

export default store;
