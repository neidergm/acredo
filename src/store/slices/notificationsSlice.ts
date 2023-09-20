import { PayloadAction, createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { GET_NOTIFICATIONS_REPORT } from "../../services/endPointsService";
import { I_Notification } from "../../interfaces/notification.interface";
import { I_NotificationsState } from "../../interfaces/store.interface";

const name = "notifications";

const initialState = (): I_NotificationsState => ({
    list: null,
    unreadCount: 0
})

export const getNotificationsReport = createAsyncThunk(`${name}/getContionData`, async () => {

    const resp = await AXIOS_REQUEST(GET_NOTIFICATIONS_REPORT).then(r => r.data)

    return resp?.[0].pendientes || 0;
});


const notificationsSlice = createSlice({
    name,
    initialState,
    reducers: {
        setNotificationsList: (state, action: PayloadAction<I_Notification[] | null>) => {
            state.list = action.payload;
            state.unreadCount = action.payload?.reduce((p: number, c: I_Notification) => p + (!c.est_noti ? 1 : 0), 0) || 0;
        },
        setNotificationsReport: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getNotificationsReport.fulfilled, (state, action) => {
            state.unreadCount = action.payload;
        });
    },
})

export default notificationsSlice.reducer;

export const {
    setNotificationsList,
    setNotificationsReport
} = notificationsSlice.actions;
