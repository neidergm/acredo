import { T_LoaderProps } from '../../hooks/useLoader';
import { I_AppAction } from '../../interfaces/store.interface';
import { OPEN_LOADER, CLOSE_LOADER } from '../actions/loaderActions';

const initialState: T_LoaderProps = {
    isOpen: false
}

const loaderReducer = (state = initialState, action: I_AppAction): T_LoaderProps => {
    switch (action.type) {
        case OPEN_LOADER:
            return {
                ...state,
                ...action.payload,
                isOpen: true,
            };
        case CLOSE_LOADER:
            return {
                ...state,
                onClosed: action.payload,
                isOpen: false,
            };

        default:
            return state;
    }

}

export default loaderReducer;
