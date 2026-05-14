import type { T_NotificationType } from "../interfaces/notification.interface";

export const getNotificationLabel = (type: T_NotificationType) => {
    switch (type) {
        case 0:
            return "Resumen";
        case 1:
            return "Asignación";
        case 2:
            return "Pendiente por cumplir";
        default:
            return "Desconocido";
    }
};

export const getNotificationSubject = (asun_noti: string) => {
    return asun_noti.replace(/^\[.+\]/, "").trim();
}