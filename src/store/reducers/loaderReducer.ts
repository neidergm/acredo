import { T_LoaderProps } from '../../hooks/useLoader';
import { I_AppAction } from '../../interfaces/store.interface';
// import { OPEN_LOADER, CLOSE_LOADER, UPDATE_LOADER } from '../actions/loaderActions';

const initialState: T_LoaderProps = {
    isOpen: false
}

const loaderReducer = (state = initialState, action: I_AppAction): T_LoaderProps => {
    switch (action.type) {
        // case OPEN_LOADER:
        //     // if (!state.isOpen && action.payload.onOpened === null) {
        //         console.log({state, action})
        //     if (action.payload.onOpened === null) {
        //         return {
        //             ...state,
        //             ...action.payload
        //         }
        //     }
        //     // console.log(state)
        //     return {
        //         ...state,
        //         ...action.payload,
        //         isOpen: true,
        //     };
        // case UPDATE_LOADER:
        //     return {
        //         ...state,
        //         ...action.payload,
        //         onClosed: () => {
        //             state.onClosed?.()
        //             action.payload?.onClosed?.()
        //         }
        //     };
        // case CLOSE_LOADER:
        //     return {
        //         ...state,
        //         onClosed: () => {
        //             state.onClosed?.()
        //             action.payload?.()
        //         },
        //         isOpen: false,
        //     };

        default:
            return state;
    }

}

export default loaderReducer;
