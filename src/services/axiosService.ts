import axios from 'axios';
import { baseUrl } from './constantsService';
import localStorageService from './localStorageService';

let token_storaged = "";
let otherConfig = {
    validateStatus: (status: number) => {
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
 * @param {boolean} formData if request must be used as formData
 * @param {String} completeUrl URL complete 
 * @param {Object} header custom headers params 
 * @param {String} token token for a particular request 
 */
const AXIOS_REQUEST = (url: string, method = "get", data = null, formData = false, header = {}, onUploadProgress = (p: any) => { }) => {
    if(!(token_storaged)){
        setTokenForAxiosRequest(localStorageService.getItem("token"))
    }
    let headers: any = {
        ...header,
        'Authorization': `Bearer ${token_storaged}`,
        'Content-Type': 'application/json'
    }
    let params = null;
    if (method !== "get" && method !== "delete" && formData) {
        headers = {
            ...headers,
            'Process-Data': false,
            "Content-Type": false
        }
    } else if (method === "get" || method === "delete") {
        params = data;
    }

    return axios({
        method,
        url: `${baseUrl}/${url}`,
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

