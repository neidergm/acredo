import axios from 'axios';
import { BASE_URL } from './constantsService';
import localStorageService from './localStorageService';
import { I_JSONObject } from '../interfaces/generic.interface';

let token_storaged = "";
let otherConfig = {
    validateStatus: (status: number) => {
        if (status === 401) {
            localStorageService.deleteItems(["user", "token"]);
            window.location.reload();
        }
        return status >= 200 && status < 300; // default
    }
};

const setTokenForAxiosRequest = (token: string) => {
    token_storaged = token;
    return token;
};

const setOtherAxiosConfig = (config = {}) => { otherConfig = { ...otherConfig, ...config } };

/**
 * Axios API request for users make requets
 * @param {String} endpoint End point of API
 * @param {String} method post, get, put, delete
 * @param {any} data Data to send
 * @param {Object} header custom headers params 
 * @param {String} token token for a particular request 
 */
// const AXIOS_REQUEST = (url: string, method = "get", data: any = null, header = {}, onUploadProgress?: (p: any) => void) => {
const AXIOS_REQUEST = (url: string, method = "get", data: null | FormData | I_JSONObject | string = null, header = {}, onUploadProgress?: (p: any) => void) => {
    method = method.toLowerCase();

    if (!(token_storaged)) {
        token_storaged = setTokenForAxiosRequest(localStorageService.getItem("token"))
    }
    let headers: any = {
        ...header,
        'Authorization': `Bearer ${token_storaged}`,
        'Content-Type': 'application/json'
    }
    let params = null;
    if (method !== "get" && method !== "delete" && data instanceof FormData) {
        headers = {
            ...headers,
            'Process-Data': false,
            "Content-Type": false
        }
    } else if (method === "get" || method === "delete") {
        if (typeof data === "string") {
            url += data
        } else {
            params = data;
        }
    }

    return axios({
        method,
        url: /^http(s)?:\/{2}.+/.test(url) ? url : `${BASE_URL}/${url}`,
        data,
        params,
        headers,
        onUploadProgress,
        ...otherConfig
    }).then(resp => {
        return resp?.data
    }).catch(err => {
        throw new Error(err);
    })
}

export {
    AXIOS_REQUEST,
    setTokenForAxiosRequest,
    setOtherAxiosConfig
};

