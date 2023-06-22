import { T_AppDispatch } from "..";
import { I_Notification } from "../../interfaces/notification.interface";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { GET_NOTIFICATIONS_REPORT } from "../../services/endPointsService";

// CONST ACTIONS
export const SET_NOTIFICATIONS_LIST = "SET_NOTIFICATIONS_LIST";
export const SET_NOTIFICATIONS_REPORT = "SET_NOTIFICATIONS_REPORT";

// =============================================================
// ACTIONS
export const setNotificationsList = (payload: I_Notification[] | null) => ({ type: SET_NOTIFICATIONS_LIST, payload });
export const setNotificationsReport = (payload: number) => ({ type: SET_NOTIFICATIONS_REPORT, payload });

export const getNotificationsReport = () => {
    return (dispatch: T_AppDispatch) => {
        return AXIOS_REQUEST(GET_NOTIFICATIONS_REPORT).then(r => {
            dispatch(setNotificationsReport(r.data?.[0].pendientes || 0))
        }).catch()
    }
};

