import { useEffect, useRef } from 'react';
import { Badge, DropdownToggle, Input } from 'reactstrap';
import useFilters from '../../hooks/useFilters';
import { type I_Program } from '../../interfaces/programs.interface';
import CustomDropdown from '../CustomDropdown';
import { Funnel } from '../Icons';
import classnames from "classnames";
import style from './style.module.css'
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setFilterProgramParams } from '../../store/slices/programsSlice';
import { useAppSelector } from '../../hooks/useAppSelector';

type T_Props = {
    list: I_Program[],
    updateList: (newList: I_Program[]) => void
}

const ProgramFilter = ({ list, updateList }: T_Props) => {

    const dispatch = useAppDispatch();
    const filterParams = useAppSelector(s => s.programs.filter);
    const filterLoaded = useRef(false)

    const { filter, doFilter, setActiveFilters, getActiveFilters, quitAllActiveFilters, setDataList } = useFilters<I_Program>({
        onFilterList: (filterdList: typeof list) => updateList(filterdList),
        list,
        filters: filterParams || {
            nomb_prog: {
                label: "Buscar por nombre",
            },
            estado: {
                label: "Estado",
                isSelect: true,
            },
            facultad: {
                label: "Facultad",
                isSelect: true,
            },
            nomb_ciud: {
                label: "Ciudad",
                isSelect: true,
            },
            nomb_depa: {
                label: "Departamento",
                isSelect: true,
            },
            nivel_prog: {
                label: "Nivel",
                isSelect: true,
            },
            moda_prog: {
                label: "Modalidad",
                isSelect: true,
            },
            tform_prog: {
                label: "Tipo de formación",
                isSelect: true,
            }
        }
    });

    useEffect(() => {
        if (filterLoaded.current) {
            setDataList(list)
            doFilter("", "")
        }
    }, [list])

    useEffect(() => {
        filterLoaded.current = true;

        return () => {
            filter && dispatch(setFilterProgramParams(filter))
        }
    }, [])

    const filtersLength = getActiveFilters().length

    return (
        <>
            <div className='d-inline-block'>
                <CustomDropdown
                    options={
                        [...Object.keys(filter).map(f => ({
                            text: <><Input type='checkbox' defaultChecked={!!(filter[f].active)} className='me-2' />{filter[f].label}</>,
                            click: () => setActiveFilters(f)
                        })),
                        { text: <></>, optionProps: { divider: true, className: "opacity-50" } },
                        {
                            text: <span className='small text-danger'>Quitar todos los filtros</span>,
                            click: quitAllActiveFilters,
                            optionProps: { className: classnames("mt-1", { "opacity-50": !(filtersLength) }), disabled: !(filtersLength) }
                        }]
                    }>
                    <DropdownToggle size="sm" color='light' className='text-primary position-relative text-end'>
                        {!!(filtersLength) && <Badge color='warning' pill>{filtersLength}</Badge>} <Funnel /> Aplicar filtros
                    </DropdownToggle>
                </CustomDropdown>
            </div>
            <div>
                <div className='pt-4 d-flex gap-3 flex-wrap w-100'>
                    {Object.keys(filter).map(f =>
                        filter[f].active && (
                            filter[f].isSelect ?
                                !!((filter[f].options?.length || 0) > 1) && <div key={f} className={style["item-filter"]}>
                                    <label htmlFor={f} className="form-label small mb-1 d-flex justify-content-between gap-3">
                                        <span>{filter[f].label}</span>
                                        <small className='link-primary' onClick={() => setActiveFilters(f)}>Quitar</small>
                                    </label>
                                    <select value={filter[f].value} id={f} className='form-select w-auto border text-secondary' onChange={e => doFilter(f, e.target.value)}>
                                        <option value="">Todos</option>
                                        {filter[f].options!.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                :
                                <div key={f} className={style["item-filter"]}>
                                    <label htmlFor={f} className="form-label small mb-1 d-flex justify-content-between gap-3">
                                        <span>{filter[f].label}</span>
                                        <small className='link-primary' onClick={() => setActiveFilters(f)}>Quitar</small>
                                    </label>
                                    <input
                                        value={filter[f].value}
                                        placeholder='Búsqueda'
                                        className='form-control'
                                        type='search'
                                        style={{ width: "200px" }}
                                        onChange={e => doFilter(f, e.target.value)}
                                    />
                                </div>
                        )
                    )}
                </div>
            </div>
        </>
    )
}

export default ProgramFilter;
