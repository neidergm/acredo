export const BASE_URL = window._NGconfig.api_base_url;

export const GOOGLE_CLIENT_ID = window._NGconfig.google_client.id;

export const ERROR_REPORTING_URL = window._NGconfig.error_reporting_url;

export const FORMATION_TYPES_LIST = window._NGconfig.formation_type;

export const SELECT_PROCESS_TYPE_FILTER = "process/selectedFilterValue";

export const APP_TITLE = window._NGconfig.app_title;

export const APP_COLORS = window._NGconfig.app_colors;

export const APP_HELP_LINK = window._NGconfig.app_help_link;

export const stringBase64 = (value: unknown, decrypt?: boolean) => {
    if (!value) return value;
    let result = value;
    if (decrypt === true) {
        try {
            result = decodeURIComponent(escape(window.atob(String(value))));
            return JSON.parse(result as string);
        } catch {
            return result;
        }
    }
    const str = typeof result === "object" ? JSON.stringify(result) : String(result);
    return window.btoa(unescape(encodeURIComponent(str)));
}
