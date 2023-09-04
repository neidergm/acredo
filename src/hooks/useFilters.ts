import React, { useState, useRef, useEffect } from 'react'

export type T_Filter = {
    [key: string]: {
        label: string;
        isSelect?: boolean,
        value?: string;
        options?: Array<string>; //For selects
        selected?: boolean;
    }
}

const useFilters = <T>(
    { filters, list = [], onFilterList }:
        { filters: T_Filter, list?: T[], onFilterList: (list: T[]) => void }
) => {

    const dataList = useRef(list);
    const [filter, setFilter] = useState(filters);

    const setSelectedFilters = (property: string) => {
        filter[property].selected ? doFilter(property, "", true) : setFilter(f => { f[property].selected = true; return { ...f } })
    }

    const quitAllSelectedFilters = () => {
        Object.keys(filter).forEach(i => { filter[i].selected = false })
        setFilter({ ...filter })
        onFilterList(dataList.current)
    }

    const setDataList = (l: typeof list, restartFilters = false) => {
        dataList.current = l;
        if (restartFilters) {
            buildFiltersByList(l)
            setFilter({ ...filters })
        }
    }

    const doFilter = (property: string, value: string, quitSelectedFilter = false) => {
        const f = filter;
        f[property].value = value;
        if (quitSelectedFilter) f[property].selected = false;

        const keys = Object.keys(f).filter(i => !!(f[i].value));
        let filtered = dataList.current;

        if (keys.length) {
            filtered = filtered.filter(p => keys.every(k => f[k].options ?
                !!((p as any)[k] === f[k].value)
                : new RegExp(f[k].value || "", "i").test((p as any)[k])))
        }

        setFilter({ ...f })
        onFilterList(filtered)
        return filtered
    }

    const buildFiltersByList = (l = dataList.current) => {
        const f = { ...filter };
        for (let i = 0; i < l.length; i++) {
            const p: T = l[i];
            // p.est_resolution = p.fech_reso ? (getDateDiff(p.fech_reso, new Date()) < 0 ? "Vencida" : "Activa") : "Sin resolución";
            for (const key in f) {
                if (f[key].isSelect) {
                    const val = (p as any)[`${key}`];
                    if (!f[key].options) f[key].options = [];
                    if (val && !f[key].options?.includes(val)) f[key].options!.push(val)
                }
            }
        }
        for (const key in f) {
            if(f[key].isSelect && f[key]?.options!.length <= 1) delete f[key];
        }
        setFilter(f);
    }

    const getSelectedFilters = () => Object.keys(filter).filter(i => filter[i].selected)

    useEffect(() => { buildFiltersByList() }, [])

    return {
        setSelectedFilters,
        quitAllSelectedFilters,
        getSelectedFilters,
        filter,
        setFilter,
        doFilter,
        setDataList
    }
}

export default useFilters;
