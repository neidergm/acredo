import { createApi } from "@reduxjs/toolkit/query/react";
import { RTKBaseQuery } from "../axiosService";

// API slice "raíz" vacía. Cada recurso se inyecta en su propio archivo vía
// `baseApi.injectEndpoints` — evita un archivo gigante de endpoints.
//
// Para agregar un tag type nuevo en el futuro, extender `tagTypes` aquí.
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: RTKBaseQuery,
    tagTypes: [
        "Notification",
        "NotificationCount",
        "Process",
        "ProcessIndicators",
        "ProcessType"
    ],
    endpoints: () => ({}),
});
