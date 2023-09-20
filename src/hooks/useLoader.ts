import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { close, open } from '../store/slices/loaderSlice';

type T_State = {
    isOpen: boolean,
    onClosed?: () => void,
    onOpened?: (() => void) | null,
    children?: JSX.Element | JSX.Element[] | string | null
}

type T_LoaderOptions = {
    title?: string | JSX.Element | JSX.Element[];
    subtitle?: string | JSX.Element | JSX.Element[] | null | false;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    loaderAsModal?: boolean;
}

export type T_LoaderProps = T_State & T_LoaderOptions;

const useLoader = (props: T_State = { isOpen: false }, options?: T_LoaderOptions) => {

    const dispatch = useAppDispatch()
    const loading = useAppSelector(s => s.loader)

    /**
     * @param content 
     * @param callbackOnStartLoading - If if null then only update if the loader is opened  
     * @param options 
     * @returns 
     */
    const openLoader = (content: T_State["children"], callbackOnStartLoading?: T_State["onOpened"] | null, options?: Omit<T_LoaderProps, "isOpen" | "onOpened">) => {
        const opts = { ...(options || {}), onOpened: callbackOnStartLoading }
        dispatch(open({ children: content, ...opts }))
    }

    // const openLoader = (content: T_State["children"], callbackOnStartLoading?: T_State["onOpened"] | null, options?: T_LoaderOptions) => {

    //     console.log(isOpen())

    //     if (callbackOnStartLoading === null && !isOpen()) {
    //         return null
    //     }

    //     const opts = { ...(options || {}), onOpened: callbackOnStartLoading || undefined }
    //     dispatch(open({ children: content, ...opts }))
    // }

    const closeLoader = (callbackOnLoaded?: T_State["onClosed"]) => {
        dispatch(close(callbackOnLoaded))
        // setLoading(l => ({ ...l, isOpen: false, onClosed: callbackOnLoaded }))
    }

    return {
        loading, openLoader, closeLoader
    }
}

export default useLoader
// import { useState } from 'react'

// type T_State = {
//     isOpen: boolean,
//     onClosed?: () => void,
//     onOpened?: () => void,
//     children?: JSX.Element | JSX.Element[] | string | null
// }

// type T_LoaderOptions = {
//     title?: string | JSX.Element | JSX.Element[];
//     subtitle?: string | JSX.Element | JSX.Element[] | null | false;
//     size?: 'sm' | 'md' | 'lg' | 'xl';
//     loaderAsModal?: boolean;
// }

// export type T_LoaderProps = T_State & T_LoaderOptions;

// const useLoader = (props: T_State = { isOpen: false }, options?: T_LoaderOptions) => {

//     const [loading, setLoading] = useState<T_State>({ ...props, ...options })

//     const openLoader = (content: T_State["children"], callbackOnStartLoading?: T_State["onOpened"], options?: T_LoaderOptions) => {
//         setLoading({ isOpen: true, children: content, onOpened: callbackOnStartLoading, ...options })
//     }

//     const closeLoader = (callbackOnLoaded?: T_State["onClosed"]) => {
//         setLoading(l => ({ ...l, isOpen: false, onClosed: callbackOnLoaded }))
//     }

//     return {
//         loading, openLoader, closeLoader
//     }
// }

// export default useLoader