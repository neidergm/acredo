import { useState } from 'react'
import { type I_AlertObject } from '../components/Alert';

// type T_State = Pick<I_AlertObject, "isOpen" | "children" | "onClosed" | "onOpened">;

type T_AlertProps = I_AlertObject;

const useAlert = (props: T_AlertProps = { isOpen: false }) => {

    const [alertData, setAlertData] = useState<T_AlertProps>(props)

    // const openAlert = (content: T_State["children"], callbackOnStartLoading?: T_State["onOpened"], options?: T_AlerOptions) => {
    const openAlert = (props: Omit<T_AlertProps, "isOpen">) => {
        setAlertData({ ...props, isOpen: true })
    }

    const closeAlert = (callbackOnLoaded?: T_AlertProps["onClosed"]) => {
        setAlertData(ad => ({ ...ad, isOpen: false, onClosed: callbackOnLoaded }))
    }

    return {
        alertData: {
            closeAlert,
            ...alertData
        },
        openAlert, closeAlert
    }
}

export default useAlert;
