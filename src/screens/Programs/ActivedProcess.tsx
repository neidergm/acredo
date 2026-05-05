import React, { useEffect, useState } from 'react'
import { AXIOS_REQUEST } from '../../services/axiosService'
import { GET_ACTIVE_PROCESS } from '../../services/endPointsService'
import { type I_Process } from '../../interfaces/process.interface';
import { ExclamationCircleFill, Kanban } from '../../components/Icons';
import { ProcessResumeItem } from '../Dashboard/ProcessResume';
import { useNavigate } from 'react-router';
import Loader from '../../components/Loader';

type T_Props = {
    id_program: string;
    quantity: number;
}

const ActivedProcess = ({ id_program, quantity }: T_Props) => {

    const [process, setProcess] = useState<null | false | I_Process[]>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (quantity === 0) {
            setProcess([])
        } else {
            AXIOS_REQUEST(GET_ACTIVE_PROCESS + id_program).then(res => {
                setProcess(res.data)
            }).catch(_e => {
                setProcess(false)
            })
        }
    }, [])

    if (process === false) {
        return <div className='p-5 text-center text-secondary opacity-50'>
            <p className='text-secondary'><ExclamationCircleFill size={30} /></p>
            <span>No se pudo cargar los procesos</span>
        </div>
    } else if (process === null) {
        return <div className='p-5 text-center'>
            <Loader loaderAsModal={false} >
                <div className='small'>Consultando procesos</div>
            </Loader>
        </div>
    } else if (process.length === 0) {
        return <div className='p-5 text-center text-secondary opacity-50'>
            <p className='text-secondary'><Kanban size={30} /></p>
            <span>No tiene procesos en curso</span>
        </div>
    }

    return (<>
        {process.map((p, idx) => <React.Fragment key={`${p.id_conv}-${idx}`}>
            {idx !== 0 && <div className='mx-3 opacity-50'><hr className='border-secondary' /></div>}
            <ProcessResumeItem process={p as I_Process} pickItem={() => navigate(`/proceso/${p.id_conv}`)} />
        </React.Fragment>)}
    </>
    )
}

export default ActivedProcess