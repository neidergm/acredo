export const BASE_API = process.env.NODE_ENV ==="production" ? "https://axis.curn.edu.co/apisiac": "https://axis.curn.edu.co/apisiac";
export const baseUrl = `${BASE_API}/api`;

export const localstorageItemPrefix = "CONDITIONS_/";

export const GOOGLE_CLIENT_ID = "227610805652-c451askq3usbv82f8e7v6g3qd6i1vdpq.apps.googleusercontent.com";

export const ERROR_REPORTING_URL = "https://axis.curn.edu.co/apildap/api/log/errorwrite";

export const stringBase64 = (str: string | null, decrypt?: boolean) => {
    if (!str) return str;
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
