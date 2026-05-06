import { stringBase64 } from "./constantsService"

const prefix = window._NGconfig.storage_prefix;

export default {
    setItem: function (name: string, value: unknown) {
        localStorage.setItem(stringBase64(`${prefix}${name}`), stringBase64(value))
    },
    setItems: function (object: Record<string, unknown>) {
        for (const key in object) { this.setItem(`${key}`, object[key]) }
    },
    getItem: function (name: string) { return stringBase64(localStorage.getItem(stringBase64(`${prefix}${name}`)), true) },
    getItems: function (names_array: Array<string>) {
        return names_array.reduce((prev: { [key: string]: string }, current: string) => {
            prev[current] = this.getItem(`${current}`);
            return prev;
        }, {})
    },
    deleteItem: function (name: string) { localStorage.removeItem(stringBase64(`${prefix}${name}`)) },
    deleteItems: function (names_array: Array<string>) {
        names_array.forEach(e => { this.deleteItem(`${e}`) })
    },
    clear: function () { localStorage.clear() }
}


export const sessionStorageService = {
    setItem: function (name: string, value: unknown) {
        sessionStorage.setItem(stringBase64(`${prefix}${name}`), stringBase64(value))
    },
    setItems: function (object: Record<string, unknown>) {
        for (const key in object) { this.setItem(`${key}`, object[key]) }
    },
    getItem: function (name: string) { return stringBase64(sessionStorage.getItem(stringBase64(`${prefix}${name}`)), true) },
    getItems: function (names_array: Array<string>) {
        return names_array.reduce((prev: { [key: string]: string }, current: string) => {
            prev[current] = this.getItem(`${current}`);
            return prev;
        }, {})
    },
    deleteItem: function (name: string) { sessionStorage.removeItem(stringBase64(`${prefix}${name}`)) },
    deleteItems: function (names_array: Array<string>) {
        names_array.forEach(e => { this.deleteItem(`${e}`) })
    },
    clear: function () { sessionStorage.clear() }
}
