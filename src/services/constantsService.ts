export const BASE_API = "https://axis.curn.edu.co";
export const baseUrl = `${BASE_API}/apisiac/api`;
// export const baseUrl = `${BASE_API}/apiprueba/api`;

export const localstorageItemPrefix = "SIAC/";

export const ERROR_REPORTING_URL = "https://axis.curn.edu.co/apildap/api/log/errorwrite";

export const stringBase64 = (str: string, decrypt?: boolean) => {
    if (decrypt === true) {
        try {
            str = decodeURIComponent(escape(window.atob(str)));
            return JSON.parse(str);
        } catch (error) {
            return str;
        }
    } else {
        if (typeof str === "object") { str = JSON.stringify(str) }
        return window.btoa(unescape(encodeURIComponent(str)));
    }
}
