import { useState } from 'react'

type T_State = {
    isOpen: boolean,
    onClosed?: () => void,
    onOpened?: () => void,
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

    const [loading, setLoading] = useState<T_State>({ ...props, ...options })

    const openLoader = (content: T_State["children"], callbackOnStartLoading?: T_State["onOpened"], options?: T_LoaderOptions) => {
        setLoading({ isOpen: true, children: content, onOpened: callbackOnStartLoading, ...options })
    }

    const closeLoader = (callbackOnLoaded?: T_State["onClosed"]) => {
        setLoading({ isOpen: false, onClosed: callbackOnLoaded })
    }

    return {
        loading, openLoader, closeLoader
    }
}

export default useLoader