import { baseApi } from "./baseApi";
import { jsonToFormData } from "../../utils/formUtils";

import { type I_JSONObject } from "../../interfaces/generic.interface";
import {
    type T_ProcessIndicatorsResponse,
    type T_ProcessListArgs,
    type T_ProcessListResponse,
    type T_ProcessTypesResponse,
} from "../../interfaces/api/process.api";

export const processApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getProcesses: build.query<T_ProcessListResponse, T_ProcessListArgs>({
            query: (args) => args?.status ? `conv/all/${args.status}` : "conv",
            providesTags: ["Process"],
        }),
        getProcessIndicators: build.query<T_ProcessIndicatorsResponse, void>({
            query: () => "conv/estados",
            providesTags: ["ProcessIndicators"],
        }),
        getProcessTypes: build.query<T_ProcessTypesResponse, void>({
            query: () => "cond/tipos",
            providesTags: ["ProcessType"],
        }),
        createProcess: build.mutation<unknown, I_JSONObject>({
            query: (body) => ({
                url: "conv",
                method: "POST",
                data: jsonToFormData(body),
            }),
            invalidatesTags: ["Process", "ProcessIndicators"],
        }),
        updateProcess: build.mutation<unknown, I_JSONObject>({
            query: (body) => ({
                url: "conv",
                method: "PUT",
                data: jsonToFormData(body),
            }),
            invalidatesTags: ["Process"],
        }),
        deleteProcess: build.mutation<unknown, number>({
            query: (id_conv) => ({
                url: `conv/${id_conv}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Process", "ProcessIndicators"],
        }),
    }),
});

export const {
    useGetProcessesQuery,
    useGetProcessIndicatorsQuery,
    useGetProcessTypesQuery,
    useCreateProcessMutation,
    useUpdateProcessMutation,
    useDeleteProcessMutation,
} = processApi;
