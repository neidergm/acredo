import { type PayloadAction, createSlice, } from "@reduxjs/toolkit";
import { type T_LoaderProps } from "../../hooks/useLoader";

const name = "loader";

const initialState = (): T_LoaderProps => ({
    isOpen: false
})

const loaderSlice = createSlice({
    name,
    initialState,
    reducers: {
        open: (state, action: PayloadAction<Omit<T_LoaderProps, "isOpen">>) => {
            if (action.payload.onOpened === null) {
                return {
                    ...state,
                    ...action.payload
                }
            } else {
                return {
                    ...state,
                    ...action.payload,
                    isOpen: true,
                };
            }
        },
        close: (state, action: PayloadAction<T_LoaderProps["onClosed"]>) => {
            return {
                ...state,
                ...action.payload,
                isOpen: false,
                onClosed: action.payload
                    // state.onClosed?.()
                    // action.payload?.()
                // }
            };
        },
    }
})

export default loaderSlice.reducer;

export const {
    close,
    open,
} = loaderSlice.actions;
