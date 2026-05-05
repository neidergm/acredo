import { useEffect, useState } from 'react'
import { Input } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';
// import { T_SelectWithValidationsProps } from 'react-ngm-form/dist/interfaces/FormElements.interface';

// type T_Props = Omit<T_SelectWithValidationsProps, "tag" | "type" | "validations"> & {
type T_Xprops = {
    // ref: Ref<any>,
    onChange: (data: string) => void,
    onBlur: (data: string) => void,
    value: string
};

type T_Props = {
    name: string;
    invalid: boolean;
    disabled: boolean;
    key: string;
    options: Array<any>;
    request?: {
        "url": string,
        "method": string,
        "params": { [x: string]: any }
    };
    wrapperClassName: string;
    defaultValue?: string;
    className?: string;
    placeholder?: string;
} & T_Xprops;


const EvidenceSelect = ({
    wrapperClassName,
    placeholder,
    onChange,
    onBlur,
    request,
    disabled,
    ...props
}: T_Props
) => {

    const [selectedValue, setSelectedValue] = useState("");
    const [options, setOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setSelectedValue("");
        if (request) {
            setLoading(true)
            AXIOS_REQUEST(request.url, request.method, request.params).then(r => {
                setLoading(false)
                setOptions(r.data)
            })
        } else {
            if (options.length) {
                setOptions([])
            }
        }

    }, [request])
    // useEffect(() => {
    //     console.log(selectedCriterial)
    //     setSelectedValue("");
    //     if (selectedCriterial) {
    //         setLoading(true)
    //         AXIOS_REQUEST(request.url, request.method, request.params).then(r => {
    //             setLoading(false)
    //             setOptions(r.data)
    //         })
    //     } else {
    //         if (options.length) {
    //             setOptions([])
    //         }
    //     }

    // }, [selectedCriterial, request])

    return (
        <div className={wrapperClassName}>
            <Input
                disabled={loading || disabled}
                {...props}
                type="select"
                onChange={({ target: { value } }) => {
                    onChange(value);
                    setSelectedValue(value);
                }}
            >
                <option value="">{loading ? "Cargando..." : (placeholder || "Seleccionar...")}</option>
                {options.map((o, i) => <option className={o.value} key={i} title={o.label}>{o.label}</option>)}
            </Input>

            {selectedValue && <div className='text-secondary mt-2'><i><small>Seleccionado: "{selectedValue}"</small></i></div>}
        </div>
    )
}

export default EvidenceSelect