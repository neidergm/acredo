import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { SubHeader } from "../components/SubHeader";
import { Badge, Button } from 'reactstrap';
import Loader from '../components/Loader';
import { I_Process } from '../interfaces/process.interface';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { getProcessList, selectProcess } from '../store/actions/processActions';
import CircleProgress from '../components/CircleProgress';
import Card from '../components/Card';
import { Folder2Open, Plus } from '../components/Icons';

const Process = () => {

  const navigate = useNavigate();
  const processList = useAppSelector(state => state.process.list);
  const dispatch = useAppDispatch();

  const goToConditionsScreen = (process: I_Process) => {
    dispatch(selectProcess(process));
    navigate(`/proceso/${process.id_conv}`);
  }

  const createNewProces = () => {

  }

  useEffect(() => {
    if (!(processList?.length)) {
      dispatch(getProcessList())
    }
  }, [])

  return (
    <>
      <SubHeader text={'Procesos'} className="container">
        <div className='d-flex align-items-center'>
          <Button color='primary' size='sm' className='opacity-75 rounded-2' onClick={() => createNewProces()} disabled>
            <i><Plus /></i>
            Crear nuevo proceso
          </Button>
        </div>
      </SubHeader>
      <div className="container pt-3 pb-5">
        {!(processList) ?
          <Loader loaderAsModal={false} isOpen />
          :
          !(processList.length) ? <div className='mt-5 pt-5 text-center'>
            <h3 className='text-muted opacity-25 mt-5 mb-5'>
              <span className='my-4 d-block'><Folder2Open size={50} /></span>
              No hay nada para mostrar
            </h3>
          </div>
            :
            processList.map(process => (
              <Card className='mb-4 hover-scale-up' key={process.id_conv} onClick={() => goToConditionsScreen(process)}>
                <div className="position-absolute" style={{ top: "-13px" }}>
                  <Badge
                    color="warning"
                    pill
                    className="text-uppercase px-3"
                  >
                    {process.tipo_cond}
                  </Badge>
                </div>
                <div className="gap-3 d-flex">
                  <div className="flex-grow-1">
                    <div className='mb-3'>
                      <b className="d-block small">Nombre:</b>
                      <span>{process.nomb_conv}</span>
                    </div>
                    <div className='d-flex gap-3 flex-wrap'>
                      <div>
                        <b className="d-block small">Sede:</b>
                        <span>{process.sede}</span>
                      </div>
                      {!!(process.fase_actual) && <div>
                        <b className="d-block small">Fase actual:</b>
                        <span>{process.fase_actual}</span>
                      </div>
                      }
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='mb-2'>
                      <b className="small">Estado:</b>
                      <span className="d-block small">{process.est_conv === 1 ? "ABIERTA" : "CERRADA"}</span>
                    </div>
                    <div>
                      <CircleProgress
                        progress={process.porcentaje || 0}
                        stroke={4}
                        radius={32}
                        color={process.porcentaje >= 100 ? "#0d6efd" : undefined}
                        content={`${process.porcentaje || 0}%`}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))
        }
      </div>
    </>
  );
};

export default Process;
