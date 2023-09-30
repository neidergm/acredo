import React, { useState } from 'react'
import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap'
import { I_DeanAndDirector } from '../../interfaces/programs.interface';
import Card from '../../components/Card';

type T_Props = {
    list: I_DeanAndDirector[];
    children: (toggleSide: () => void) => JSX.Element;
}

const DeansAndDirectors = ({ children, list }: T_Props) => {

    const [showAll, setShowAll] = useState(false);
    const toggle = () => {
        setShowAll(v => !v)
    }

    const printAllUsers = () => {
        return list.map((d, i) => <Card key={i} className='shadow-none bg-light mb-3'>
            <p className='fw-semibold'>{d.nomb_cargo}</p>
            <p className='mb-0'>{d.nomb_resp}</p>
            <span className='text-muted small'>Identificación: {d.iden_resp}</span>
        </Card>)
    }

    return (
        <>
            <Offcanvas isOpen={showAll} style={{ minWidth: "40%", width: "auto" }} fade>
                <OffcanvasHeader toggle={toggle}>
                    <span className='ps-3 border-start border-success border-4 py-1'>Eventos del programa</span>
                </OffcanvasHeader>
                <OffcanvasBody>{printAllUsers()}</OffcanvasBody>
            </Offcanvas>
            {children(toggle)}
        </>
    )
}

export default DeansAndDirectors