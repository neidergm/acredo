import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SubHeader } from "../components/SubHeader";
import { Badge } from 'reactstrap';
import { AXIOS_REQUEST } from "../services/axiosService";
import { CONVOCATORIES_LIST } from "../services/endPointsService";
import Loader from '../components/Loader';
import { I_Convocatory } from '../interfaces/convocatory.interface';

let DATA: Array<I_Convocatory> | null = null;

const Convocatories = () => {

  const navigate = useNavigate();
  const [convocatories, setConvocatories] = useState(DATA);

  const goToConditionsScreen = (convocatory: I_Convocatory) => {
    navigate(`/condiciones/${convocatory.id_conv}`, { state: convocatory })
  }

  useEffect(() => {
    if (!DATA?.length) {
      AXIOS_REQUEST(CONVOCATORIES_LIST)
        .then(res => {
          setConvocatories(res.data)
          DATA = res.data;
        })
        .catch(err => {
          setConvocatories([])
        })
    }
  }, [])

  return (
    <>
      <SubHeader text={'Procesos'} />
      <div className="container pt-3 pb-5">
        {!(convocatories) ?
          <Loader loaderAsModal={false} isOpen />
          :
          !(convocatories.length) ?
            <p className='text-muted'>Sin procesos registradas</p>
            :
            convocatories.map(convocatory => (
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
                          <span className="d-block">{new Date(convocatory.fech_ini).toLocaleDateString()}</span>
                        </div>
                        <div className="d-block">
                          <b className="small">Cierre:</b>
                          <span className="d-block">{new Date(convocatory.fech_fin).toLocaleDateString()}</span>
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
