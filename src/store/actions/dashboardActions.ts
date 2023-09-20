export * from "./../slices/dashboardSlice"

// import { T_AppDispatch } from "..";
// import { AXIOS_REQUEST } from "../../services/axiosService";
// import { GET_PROCESS_INDICATORS, GET_PROGRAMS_INDICATORS } from "../../services/endPointsService";
// import { I_ProcessIndicators, T_ProgramsIndicators } from "../../interfaces/dashboard.interface";
// import { toast } from "react-hot-toast";
// import { I_Process } from "../../interfaces/process.interface";
// import { I_Program } from "../../interfaces/programs.interface";

// export const SET_PROCESS_INDICATORS = "SET_PROCESS_INDICATORS";
// export const SET_PROCESS_LIST_RESUME = "SET_PROCESS_LIST_RESUME";
// export const SET_PROCESS_SELECTED_FILTER = "SET_PROCESS_SELECTED_FILTER";

// export const SET_PROGRAMS_INDICATORS = "SET_PROGRAMS_INDICATORS";
// export const SET_PROGRAMS_LIST_RESUME = "SET_PROGRAMS_LIST_RESUME";
// export const SET_PROGRAMS_SELECTED_FILTER = "SET_PROGRAMS_SELECTED_FILTER";

// export const setProcessList = (filter: string, process: I_Process[]) => ({ type: SET_PROCESS_LIST_RESUME, payload: { filter, process } })
// export const setProcessIndicators = (payload: I_ProcessIndicators[]) => ({ type: SET_PROCESS_INDICATORS, payload })
// export const setProcessSelectedFilter = (payload: I_ProcessIndicators) => ({ type: SET_PROCESS_SELECTED_FILTER, payload })

// export const setProgramsList = (filter: string, programs: I_Program[]) => ({ type: SET_PROGRAMS_LIST_RESUME, payload: { filter, programs } })
// export const setProgramsIndicators = (payload: T_ProgramsIndicators[]) => ({ type: SET_PROGRAMS_INDICATORS, payload })
// export const setProgramsSelectedFilter = (payload: T_ProgramsIndicators) => ({ type: SET_PROGRAMS_SELECTED_FILTER, payload })

// export const getProcessIndicators = (filterSelected?: I_ProcessIndicators | null) => {
//     return (dispatch: T_AppDispatch) => AXIOS_REQUEST(GET_PROCESS_INDICATORS).then(resp => {
//         dispatch(setProcessIndicators(resp.data))
//         !filterSelected && dispatch(setProcessSelectedFilter(resp.data[0]));
//         return resp.data;
//     }).catch(() => {
//         toast.error("Error al consultar el resumen de procesos", { position: "top-right" })
//         return null
//     })
// }

// export const getProgramsIndicators = (filterSelected?: T_ProgramsIndicators | null) => {
//     return (dispatch: T_AppDispatch) => AXIOS_REQUEST(GET_PROGRAMS_INDICATORS).then(resp => {
//         dispatch(setProgramsIndicators(resp.data))
//         !filterSelected && dispatch(setProgramsSelectedFilter(resp.data[0]));
//         return resp.data;
//     }).catch(() => {
//         toast.error("Error al consultar el resumen de programas", { position: "top-right" })
//         return null
//     })
// }


