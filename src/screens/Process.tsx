import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { SubHeader } from "../components/SubHeader";
import { Badge } from 'reactstrap';
import { AXIOS_REQUEST } from "../services/axiosService";
import { CONVOCATORIES_LIST } from "../services/endPointsService";
import Loader from '../components/Loader';
import { I_Process } from '../interfaces/process.interface';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setProcessList } from '../store/actions/processActions';
import { getNormalDate } from '../utils/dateUtils';

const Convocatories = () => {

  const navigate = useNavigate();
  const processList = useAppSelector(state => state.process.list);
  const dispatch = useAppDispatch();

  const goToConditionsScreen = (process: I_Process) => {
    navigate(`/condiciones/${process.id_conv}`, { state: process })
  }

  useEffect(() => {
    if (!processList?.length) {
      AXIOS_REQUEST(CONVOCATORIES_LIST)
        .then(res => {
          dispatch(setProcessList(res.data))
        })
        .catch(err => {
          dispatch(setProcessList([]))
        })
    }
  }, [])

  return (
    <>
      <SubHeader text={'Procesos'} />
      <div className="container pt-3 pb-5">
        {!(processList) ?
          <Loader loaderAsModal={false} isOpen />
          :
          !(processList.length) ?
            <p className='text-muted'>Sin procesos registradas</p>
            :
            processList.map(convocatory => (
              <div
                key={convocatory.id_conv}
                className="card mb-4 border-0 bg-light hover-scale-up hover-shadow-sm"
                onClick={() => goToConditionsScreen(convocatory)}
              >
                <div className="card-body position-relative">
                  <div className="position-absolute" style={{ top: "-13px" }}>
                    <Badge
                      color={convocatory.tipo_cond.toLocaleLowerCase() === "institucional" ? "success" : "primary"}
                      pill
                      className="text-uppercase px-3"
                    >
                      {convocatory.tipo_cond}
                    </Badge>
                  </div>
                  <div className="row justify-content-between mt-1">
                    <div className="col-12 col-md-6 col-lg-8 mb-4 mb-md-0">
                      <b className="d-block small">Nombre:</b>
                      <span>{convocatory.nomb_conv}</span>
                    </div>
                    <div className="col">
                      <div className="d-flex gap-4 justify-content-between justify-content-sm-start justify-content-md-between">
                        <div className="d-block">
                          <b className="small">Apertura:</b>
                          <span className="d-block">{getNormalDate(convocatory.fech_ini)}</span>
                        </div>
                        <div className="d-block">
                          <b className="small">Cierre:</b>
                          <span className="d-block">{getNormalDate(convocatory.fech_fin)}</span>
                        </div>
                        <div className="d-block">
                          <b className="small">Estado:</b>
                          <span className="d-block">{convocatory.est_conv === 1 ? "ABIERTA" : "CERRADA"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </>
  );
};

export default Convocatories;
