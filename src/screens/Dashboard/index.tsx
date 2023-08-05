import { useEffect, useState } from 'react'
import { AXIOS_REQUEST } from '../../services/axiosService'
import { GET_RESUME } from '../../services/endPointsService'
import { SubHeader } from '../../components/SubHeader'
import Card from '../../components/Card'
import ProcessResume from './ProcessResume'
import ProgramsResume from './ProgramsResume'
import classnames from 'classnames';
import styles from './style.module.css';
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { JournalBoomark, Kanban, People } from '../../components/Icons'

const Menu = () => {
    return <div className='d-flex gap-2'>
        <div>
            <Link to="proceso" className='btn btn-primary2 d-flex gap-2 align-items-center'>
                <Kanban size={17} />
                Procesos
            </Link>
        </div>
        <div>
            <Link to="programa" className='btn btn-primary2 d-flex gap-2 align-items-center'>
                <JournalBoomark size={17} />
                Programas
            </Link>
        </div>
        <div>
            <Link to="usuarios" className='btn btn-primary2 d-flex gap-2 align-items-center'>
                <People size={17} />
                Usuarios
            </Link>
        </div>
    </div>
}


const Dashboard = () => {

    const [tab, setTab] = useState(1);

    const pickTab = (tab: number) => {
        setTab(tab)
    }


    return (
        <>
            <SubHeader text={'Panel principal'} className="container-xxxl" >
                <div className='d-none d-lg-block mt-1'><Menu /></div>
            </SubHeader>
            <div className="container-fluid container-xxxl">

                <div className='d-flex justify-content-between gap-4 flex-wrap mb-5 align-items-center d-lg-none'>
                    <div className='d-block d-lg-none'>
                        <Menu />
                    </div>
                    <div className='d-none d-sm-block vr d-md-none'></div>
                    <div className='d-flex align-items-center gap-2'>
                        <small className='small opacity-50 d-none d-md-block'>Mostrar:</small>
                        <div className={classnames('d-flex align-items-center  justify-content-end', styles["toggler-container"])}>
                            <div className='bg-white p-1 rounded-3'>
                                <Button color={tab === 1 ? 'primary2 fw-semibold' : "link"} className='rounded-3 px-3' size='sm' onClick={() => pickTab(1)}>
                                    Procesos
                                </Button>
                                <Button color={tab === 2 ? 'primary2 fw-semibold' : "link-dark"} className='rounded-3 px-3' size='sm' onClick={() => pickTab(2)}>
                                    Programas
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className={classnames(styles['tab'], 'mb-4 col-12 col-md', { 'd-block': tab === 1 })}>

                        <ProcessResume />

                    </div>
                    <div className={classnames(styles['tab'], 'tab mb-4 col', { 'd-block': tab === 2 })}>

                        <ProgramsResume />

                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
