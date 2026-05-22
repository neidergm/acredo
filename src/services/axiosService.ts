import axios, {
    HttpStatusCode,
    AxiosError,
    type AxiosProgressEvent,
    type AxiosRequestConfig
} from 'axios';
import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from './constantsService';
import localStorageService from './localStorageService';
import { type I_JSONObject } from '../interfaces/generic.interface';
import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000
});

api.interceptors.request.use(config => {
    const token = localStorageService.getItem("token");
    if (token) config.headers.set("Authorization", `Bearer ${token}`);
    return config;
});

// Hook de 401: el store registra acá su dispatch para no acoplar el cliente axios al store.
let onUnauthorized: ((msg: string) => void) | null = null;
const setOnUnauthorized = (cb: typeof onUnauthorized) => { onUnauthorized = cb; };

// Response: unwrap data en éxito, preservar AxiosError + side-effects en error.
api.interceptors.response.use(
    resp => resp.data,
    (err: AxiosError) => {
        if (err.code === AxiosError.ERR_NETWORK) {
            toast.error("Hubo un error, tal vez se deba a su conexión a internet", {
                id: "GEN_ERROR",
                position: "bottom-center",
                duration: 10000,
                className: "bg-warning text-white",
            });
        }
        if (err.response?.status === HttpStatusCode.Unauthorized) {
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AXIOS_REQUEST = <T = any>(
    url: string,
    method = "get",
    data: null | FormData | I_JSONObject | string = null,
    header: Record<string, string> = {},
    onUploadProgress?: (e: AxiosProgressEvent) => void,
): Promise<T> => {
    method = method.toLowerCase();
    const headers: Record<string, string> = { ...header };
    let params: I_JSONObject | null = null;
    let body: typeof data = data;

    if (method === "get" || method === "delete") {
        body = null;
        if (typeof data === "string") {
            url += data;
        } else if (data && !(data instanceof FormData)) {
            params = data;
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

// ── RTK Query adapter ───────────────────────────────────────────────
export type T_BaseQueryArgs = string | AxiosRequestConfig;

export type T_BaseQueryError = {
    status: number | "FETCH_ERROR";
    data: unknown;
};

type T_ApiEnvelope<T> = {
    cod: number;
    data: T;
    msg: string;
};

type BaseQuery<T> = BaseQueryFn<T_BaseQueryArgs, T_ApiEnvelope<T>, T_BaseQueryError>;

const RTKBaseQuery: BaseQuery<unknown> = async (args) => {
    try {
        const result = await api(args as AxiosRequestConfig);
        return result;
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

export {
    AXIOS_REQUEST,
    setOnUnauthorized,
    RTKBaseQuery
};
