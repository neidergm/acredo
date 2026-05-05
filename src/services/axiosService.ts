import axios, { type AxiosProgressEvent } from 'axios';
import { BASE_URL } from './constantsService';
import localStorageService from './localStorageService';
import { type I_JSONObject } from '../interfaces/generic.interface';
import { toast } from 'react-hot-toast';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(config => {
    const token = localStorageService.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Hook de 401: el store registra acá su dispatch para no acoplar el cliente axios al store.
let onUnauthorized: ((msg: string) => void) | null = null;
const setOnUnauthorized = (cb: typeof onUnauthorized) => { onUnauthorized = cb; };

// Response: unwrap data en éxito, preservar AxiosError + side-effects en error.
api.interceptors.response.use(
    resp => resp.data,
    err => {
        if (err.code === "ERR_NETWORK") {
            toast.error("Hubo un error, tal vez se deba a su conexión a internet", {
                id: "GEN_ERROR",
                position: "bottom-center",
                duration: 10000,
                className: "bg-warning text-white",
            });
        }
        if (err.response?.status === 401) {
            onUnauthorized?.("Su sesión ha expirado");
        }
        return Promise.reject(err);
    }
);

/**
 * Wrapper para requests a la API. baseURL, auth y unwrap viven en el cliente axios.
 * @param url URL relativa al baseURL — o absoluta para pegarle a otros hosts (axios la detecta).
 * @param method "get" | "post" | "put" | "delete" (case-insensitive).
 * @param data Body para POST/PUT, params (objeto) o suffix de URL (string) para GET/DELETE.
 * @param header Headers extra para esta request.
 * @param onUploadProgress Callback de progreso para uploads.
 */
const AXIOS_REQUEST = <T = any>(
    url: string,
    method = "get",
    data: null | FormData | I_JSONObject | string = null,
    header: Record<string, string> = {},
    onUploadProgress?: (e: AxiosProgressEvent) => void,
): Promise<T> => {
    method = method.toLowerCase();
    const headers: Record<string, any> = { ...header };
    let params: I_JSONObject | null = null;
    let body: typeof data = data;

    if (method === "get" || method === "delete") {
        body = null;
        if (typeof data === "string") {
            url += data;
        } else {
            params = data as I_JSONObject;
        }
    }

    return api({
        url,
        method,
        data: body,
        params,
        headers,
        onUploadProgress,
    }) as unknown as Promise<T>;
};

export { AXIOS_REQUEST, setOnUnauthorized };
