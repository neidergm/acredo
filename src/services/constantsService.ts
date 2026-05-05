export const BASE_URL = window._NGconfig.api_base_url;

export const GOOGLE_CLIENT_ID = window._NGconfig.google_client.id;

export const ERROR_REPORTING_URL = window._NGconfig.error_reporting_url;

export const FORMATION_TYPES_LIST = window._NGconfig.formation_type;

export const SELECT_PROCESS_TYPE_FILTER = "process/selectedFilterValue";

export const APP_TITLE = window._NGconfig.app_title;

export const APP_COLORS = window._NGconfig.app_colors;

export const APP_HELP_LINK = window._NGconfig.app_help_link;

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
