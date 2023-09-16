import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// Reducers list
import userReducer from './reducers/userReducer'
import programsReducer from './reducers/programsReducer'
import dashboardReducer from './reducers/dashboardReducer'
import processReducer from './reducers/processReducer'
import { LOGOUT, setUnauthorized, SET_UNAUTHORIZED } from './actions/userActions';
import { setOtherAxiosConfig } from '../services/axiosService';
import conditionsReducer from './reducers/conditionsReducer';
import notificationsReducer from './reducers/notificationsReducer';
import loaderReducer from './reducers/loaderReducer';

// Create deducer all in one
const allReducers = combineReducers({
    dashboard: dashboardReducer,
    user: userReducer,
    programs: programsReducer,
    process: processReducer,
    conditions: conditionsReducer,
    notifications: notificationsReducer,
    loader: loaderReducer,
});

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const rootReducer = (state: any, action: any) => {
    if (action.type === LOGOUT || (action.type === SET_UNAUTHORIZED && !!(action.payload))) {
        state = undefined;
    }
    return allReducers(state, action)
}

// Config Middleware for async actions
const thunkHandler = applyMiddleware(thunk);
const composeEnhancers = (typeof window !== 'undefined' && process.env.NODE_ENV === "development" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose)

// Create the store
const store = createStore(rootReducer, composeEnhancers(thunkHandler))

setOtherAxiosConfig({
    validateStatus: (status: any) => {
        if (status === 401) {
            store.dispatch(setUnauthorized("Su sesión ha expirado"));
            return false;
        }
        return status >= 200 && status < 300; // default
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type T_AppState = ReturnType<typeof store.getState>
export type T_AppDispatch = typeof store.dispatch;

export default store;
