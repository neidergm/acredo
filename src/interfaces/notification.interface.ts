export interface I_Notification {
    // id: number;
    // message: string;
    // subject: string;
    // type: string;
    // date: string;
    // isRead: boolean;

    asun_noti: string;
    desc_noti: string;
    /**
     * 0 Is sent
     * 1 Is read
     */
    est_noti: 0 | 1;
    id_noti: number;
    id_rc: number;
    iden_resp: string;
    marc_temp: string;
    marc_update: string;
    /**
     * 0: General (Resumen)
     * 1: Asignación 
     * 2: Pendiente por cumplir
     */
    tipo_noti: 0 | 1 | 2;
    desc_tipo_noti: string;

    // html_content?: JSX.Element
}