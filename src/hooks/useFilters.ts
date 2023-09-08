import { useState, useRef, useEffect } from 'react'

export type T_Filter = {
    [key: string]: {
        label: string;
        isSelect?: boolean,
        value?: string;
        options?: Array<string>; //For selects
        active?: boolean;
    }
}

const useFilters = <T>(
    { filters, list = [], onFilterList }:
        { filters: T_Filter, list?: T[], onFilterList: (list: T[]) => void }
) => {

    const dataList = useRef(list);
    const [filter, setFilter] = useState(filters);

    const setActiveFilters = (property: string) => {
        filter[property].active ? doFilter(property, "", true) : setFilter(f => { f[property].active = true; return { ...f } })
    }

    const quitAllActiveFilters = () => {
        Object.keys(filter).forEach(i => { filter[i].active = false })
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

    const getFilteredList = (f = filter) => {
        const keys = Object.keys(f).filter(i => !!(f[i].value))

        if (keys.length) {
            return dataList.current.filter(p => keys.every(k => f[k].options ?
                !!((p as never)[k] === f[k].value)
                : new RegExp(f[k].value || "", "i").test((p as never)[k])))
        }

        return dataList.current;
    }

    const doFilter = (property: string, value: string, quitActiveFilter = false) => {
        const f = filter;
        f[property].value = value;
        if (quitActiveFilter) f[property].active = false;

        const newList = getFilteredList(f)

        setFilter({ ...f })
        onFilterList(newList)
        return newList
    }

    const buildFiltersByList = (l = dataList.current) => {
        const f = { ...filter };
        for (let i = 0; i < l.length; i++) {
            const p: T = l[i];
            // p.est_resolution = p.fech_reso ? (getDateDiff(p.fech_reso, new Date()) < 0 ? "Vencida" : "Activa") : "Sin resolución";
            for (const key in f) {
                if (f[key].isSelect) {
                    const val = (p as never)[`${key}`];
                    if (!f[key].options) f[key].options = [];
                    if (val && !f[key].options?.includes(val)) f[key].options?.push(val)
                }
            }
        }
        for (const key in f) {
            if (f[key].isSelect && (f[key].options || []).length <= 1) delete f[key];
        }
        setFilter(f);
    }

    const getActiveFilters = () => Object.keys(filter).filter(i => filter[i].active)

    useEffect(() => {
        if (getActiveFilters().length) {
            onFilterList(getFilteredList(filters))
        } else {
            buildFiltersByList()
            onFilterList(dataList.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        setActiveFilters,
        quitAllActiveFilters,
        getActiveFilters,
        filter,
        setFilter,
        doFilter,
        setDataList
    }
}

export default useFilters;
