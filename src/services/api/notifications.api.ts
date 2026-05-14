import { baseApi } from "./baseApi";
import { jsonToFormData } from "../../utils/formUtils";
import {
    type T_NotificationListResponse,
    type T_NotificationReportResponse,
    type T_MarkAsReadRequest,
    type T_MarkAsReadResponse,
} from "../../interfaces/api/notifications.api";

export const notificationsApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getNotifications: build.query<T_NotificationListResponse, void>({
            query: () => ({ url: "noti" }),
            providesTags: ["Notification"],
        }),
        getNotificationsReport: build.query<number, void>({
            query: () => ({ url: "noti/reporte" }),
            providesTags: ["NotificationCount"],
            transformResponse: (raw: T_NotificationReportResponse) =>
                raw?.[0]?.pendientes ?? 0,
        }),
        markAsRead: build.mutation<T_MarkAsReadResponse, T_MarkAsReadRequest>({
            query: (body) => ({
                url: "noti",
                method: "PUT",
                data: jsonToFormData(body),
            }),
            invalidatesTags: ["NotificationCount"],
            // Optimistic update: el item se ve leído al instante. Si la mutación falla, el patch se revierte
            onQueryStarted: async ({ id_noti }, { dispatch, queryFulfilled }) => {
                const patch = dispatch(
                    notificationsApi.util.updateQueryData(
                        "getNotifications",
                        undefined,
                        (draft) => {
                            const item = draft.find((n) => n.id_noti === id_noti);
                            if (item) item.est_noti = 1;
                        }
                    )
                );
                try {
                    await queryFulfilled;
                } catch {
                    patch.undo();
                }
            },
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useGetNotificationsReportQuery,
    useMarkAsReadMutation,
} = notificationsApi;
