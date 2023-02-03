import { stringBase64, localstorageItemPrefix } from "./constantsService"

let prefix = localstorageItemPrefix;

export default {
    setItem: function (name: string, value: any) {
        localStorage.setItem(`${prefix}${name}`, stringBase64(value))
    },
    setItems: function (object: any) {
        for (const key in object) { this.setItem(`${key}`, object[key]) }
    },
    getItem: function (name: string) { return stringBase64(localStorage.getItem(`${prefix}${name}`), true) },
    getItems: function (names_array: Array<string>) {
        return names_array.reduce((prev: { [key: string]: string }, current: string) => {
            prev[current] = this.getItem(`${current}`);
            return prev;
        }, {})
    },
    deleteItem: function (name: string) { localStorage.removeItem(`${prefix}${name}`) },
    deleteItems: function (names_array: Array<string>) {
        names_array.forEach(e => { this.deleteItem(`${e}`) })
    },
    clear: function () { localStorage.clear() }
}