import { type Ref, useEffect, useState } from 'react'
import { Input } from 'reactstrap';
import { AXIOS_REQUEST } from '../../services/axiosService';

type T_Xprops = {
    onChange: (data: string) => void,
    onBlur: () => void,
    value?: string,
};

// Props que `react-ngm-form` puede o no inyectar dependiendo del schema.
// Marcadas opcionales para que el render-prop spread (`{...f}`) tipechee.
type T_Props = {
    name: string;
    invalid?: boolean;
    disabled?: boolean;
    options?: unknown[];
    innerRef?: Ref<HTMLInputElement | HTMLTextAreaElement>;
    request?: {
        "url": string,
        "method": string,
        "params": Record<string, unknown>
    };
    wrapperClassName?: string;
    defaultValue?: string;
    className?: string;
    placeholder?: string;
} & T_Xprops;


const EvidenceSelect = ({
    wrapperClassName,
    placeholder,
    onChange,
    request,
    disabled,
    ...props
}: T_Props
) => {

    const [selectedValue, setSelectedValue] = useState("");
    const [options, setOptions] = useState<Array<{ label: string; value: string }>>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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