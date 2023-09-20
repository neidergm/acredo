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















// import { combineReducers, StoreEnhancer, EmptyObject, Store } from 'redux';
// import { configureStore } from '@reduxjs/toolkit'
// import { LOGOUT, SET_UNAUTHORIZED, getConfig, setUnauthorized } from './slices/userAction';

// // Reducers list
// import activitiesReducer from './reducers/activitiesReducer'
// import userReducer from './reducers/userReducer'

// import { setOtherAxiosConfig, setTokenForAxiosRequest } from '../../services/axiosService'
// import localStorageService, { sessionStorageService } from '../../services/localStorageService';

// const reducers = {
//     activities: activitiesReducer,
//     user: userReducer,
// }

// const allReducers = combineReducers(reducers);

// const rootReducer = (state: any, action: any) => {
//     if (action.type === LOGOUT || (action.type === SET_UNAUTHORIZED && !!(action.payload))) {
//         state = undefined;
//     }
//     return allReducers(state, action)
// }

// const userStore = configureStore({ reducer: rootReducer });

// export const createUserStore = () => {
//     console.log("CREATING USER STORE");

//     setTokenForAxiosRequest(localStorageService.getItem("token"));

//     setOtherAxiosConfig({
//         // token: localStorageService.getItem("token"),
//         validateStatus: (status: any) => {
//             console.log("Unauthorized", status)
//             if (status === 401) {
//                 localStorageService.deleteItems(["user", "token"]);
//                 userStore.dispatch(setUnauthorized(true));
//             }
//             return status >= 200 && status < 300; // default
//         }
//     });

//     try {
//         const config = sessionStorageService.getItem("config");
//         // const config = userStore?.getState()?.user.config;

//         // if (!(config) || !(config?.expireAt) || config?.expireAt < new Date().getTime()) {
//         if (!(Object.keys(config).length) || !(config?.expireAt) || config?.expireAt < new Date().getTime()) {
//             throw new Error
//         }
//     } catch (error) { userStore.dispatch(getConfig()) }

//     return userStore;
// }

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type T_UserAppState = ReturnType<typeof userStore.getState>
// export type T_UserAppDispatch = typeof userStore.dispatch;

// export default createUserStore;






// import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
// import thunk from 'redux-thunk';

// // Reducers list
// import userReducer from './reducers/userReducer'
// import programsReducer from './reducers/programsReducer'
// import dashboardReducer from './reducers/dashboardReducer'
// import processReducer from './reducers/processReducer'
// import { LOGOUT, setUnauthorized, SET_UNAUTHORIZED } from './slices/userSlice';
// import { setOtherAxiosConfig } from '../services/axiosService';
// import conditionsReducer from './reducers/conditionsReducer';
// import notificationsReducer from './reducers/notificationsReducer';
// import loaderReducer from './reducers/loaderReducer';

// // Create deducer all in one
// const allReducers = combineReducers({
//     dashboard: dashboardReducer,
//     user: userReducer,
//     programs: programsReducer,
//     process: processReducer,
//     conditions: conditionsReducer,
//     notifications: notificationsReducer,
//     loader: loaderReducer,
// });

// declare global {
//     interface Window {
//         __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
//     }
// }

// const rootReducer = (state: any, action: any) => {
//     if (action.type === LOGOUT || (action.type === SET_UNAUTHORIZED && !!(action.payload))) {
//         state = undefined;
//     }
//     return allReducers(state, action)
// }

// // Config Middleware for async actions
// const thunkHandler = applyMiddleware(thunk);
// const composeEnhancers = (typeof window !== 'undefined' && process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)

// // Create the store
// const store = createStore(rootReducer, composeEnhancers(thunkHandler))

// setOtherAxiosConfig({
//     validateStatus: (status: any) => {
//         if (status === 401) {
//             store.dispatch(setUnauthorized("Su sesión ha expirado"));
//             return false;
//         }
//         return status >= 200 && status < 300; // default
//     }
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type T_AppState = ReturnType<typeof store.getState>
// export type T_AppDispatch = typeof store.dispatch;

// export default store;
