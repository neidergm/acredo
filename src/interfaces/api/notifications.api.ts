import type { I_Notification } from "../notification.interface";

export type T_NotificationListResponse = I_Notification[];

export type T_NotificationReportResponse = Array<{ pendientes: number }>;

export type T_MarkAsReadRequest = { id_noti: number };

export type T_MarkAsReadResponse = void;
