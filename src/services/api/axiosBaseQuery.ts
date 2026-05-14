import type { BaseQueryFn } from "@reduxjs/toolkit/query/react";
import type { AxiosError, AxiosProgressEvent } from "axios";
import { AXIOS_REQUEST } from "../axiosService";
import type { I_JSONObject } from "../../interfaces/generic.interface";

export type T_BaseQueryArgs = {
    url: string;
    method?: string;
    data?: null | FormData | I_JSONObject | string;
    headers?: Record<string, string>;
    onUploadProgress?: (e: AxiosProgressEvent) => void;
};

export type T_BaseQueryError = {
    status: number | "FETCH_ERROR";
    // En error preservamos el sobre completo `{cod, data, msg}` del backend
    // (cuando hubo respuesta) o el `message` de axios (errores de red).
    // Consumidores pueden hacer `error.data?.msg` para mostrar al usuario.
    data: unknown;
};

// Sobre estándar que envuelve todas las respuestas del backend de Acredo.
type T_ApiEnvelope<T> = {
    cod: number;
    data: T;
    msg: string;
};

// Adapter sobre AXIOS_REQUEST. Aprovecha los interceptors existentes (auth header,
// 401→setUnauthorized, FormData boundary, toast ERR_NETWORK) — no se duplica nada.
// Destapa el sobre de negocio en el path de éxito: los endpoints reciben payload
// puro en `transformResponse`, sin tener que hacer `r.data` cada uno.
export const axiosBaseQuery: BaseQueryFn<T_BaseQueryArgs, unknown, T_BaseQueryError> =
    async ({ url, method, data, headers, onUploadProgress }) => {
        try {
            const envelope = await AXIOS_REQUEST<T_ApiEnvelope<unknown>>(
                url, method, data, headers, onUploadProgress
            );
            return { data: envelope.data };
        } catch (err) {
            const axiosError = err as AxiosError;
            return {
                error: {
                    status: axiosError.response?.status ?? "FETCH_ERROR",
                    data: axiosError.response?.data ?? axiosError.message,
                },
            };
        }
    };
