import React, { useEffect, useState } from 'react'
import { SubHeader } from '../components/SubHeader'
import AllAttachments from '../components/AttachmentsTable/AllAttachments'
import { useParams } from 'react-router-dom';
import { Button } from 'reactstrap';
import { XCircle } from '../components/Icons';
import { AXIOS_REQUEST } from '../services/axiosService';
import { PHASE_DETAILS } from '../services/endPointsService';
import { T_Phase, T_PhasesWithConditions } from '../interfaces/phasesAndStages.interface';
import Loader from '../components/Loader';
import Card from '../components/Card';

const PhasesAttachments = () => {
    const { id_phase } = useParams();

    const [details, setDetails] = useState<null | T_PhasesWithConditions>(null)

    useEffect(() => {
        AXIOS_REQUEST(PHASE_DETAILS + id_phase).then(resp => {
            setDetails(resp.data?.[0])
        }).catch(() => {
        })
    }, [])

    if (!details) {
        return <div>
            <Loader isOpen loaderAsModal={false} />
            <p className='my-4 text-center'>Consultando fase</p>
        </div>
    }
    return (
        <>
            <SubHeader text={'Anexos de fase'} className="container">
                <div className=''>
                    <Button color='primary' size='sm' className='pe-3 opacity-75 rounded-2 rounded-pill d-flex align-items-center gap-2'
                        onClick={() => {
                            window.close()
                        }}>
                        <XCircle />
                        Cerrar y volver
                    </Button>
                </div>
            </SubHeader>

            <div className="container pt-3 pb-5">
                <Card className='mb-4'>
                    <div>
                        <b>Fase:</b>
                        <span className="d-block">
                            {details.nomb_fase}
                        </span>
                    </div>
                </Card>
                <AllAttachments phaseId={id_phase!} />
            </div>
        </>
    )
}

export default PhasesAttachments