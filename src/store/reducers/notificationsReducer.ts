import { I_AppAction, I_NotificationsState } from '../../interfaces/store.interface';
// import { SET_NOTIFICATIONS_LIST, SET_NOTIFICATIONS_REPORT } from '../actions/notificationsActions';

const initialState: I_NotificationsState = {
    list: null,
    unreadCount: 0
}

const notificationsReducer = (state = initialState, action: I_AppAction): I_NotificationsState => {
  switch (action.type) {
        // case SET_NOTIFICATIONS_LIST:
        //     return {
        //         ...state,
        //         list: action.payload,
        //         unreadCount: action.payload?.reduce((p: number, c: any) => p + (!c.est_noti ? 1 : 0), 0),
        //     };
        // case SET_NOTIFICATIONS_REPORT:
        //     return {
        //         ...state,
        //         unreadCount: action.payload
        //     };

        default:
            return state;
    }

}

export default notificationsReducer;
