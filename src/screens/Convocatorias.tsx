import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { SubHeader } from "../components/SubHeader";
import { Badge } from 'reactstrap';
import { AXIOS_REQUEST } from "../services/axiosService";
import { CONVOCATORIES_LIST } from "../services/endPointsService";

let DATA: Array<any> = [];

const Convocatorias = () => {

  const [convocatorias, setConvocatorias] = useState<typeof DATA>(DATA);

  useEffect(() => {
    !DATA.length && AXIOS_REQUEST(CONVOCATORIES_LIST)
      .then(res => {
        setConvocatorias(res.data)
      })
      .catch(err => err)

    return () => {
      DATA = convocatorias;
    }

  })

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <SubHeader text={'Convocatorias'} />
      <div className="container pt-4" >
        {convocatorias.map((convocatoria, index) => (
          <div key={index} className="card mb-4 border-0 bg-light hover-scale-up hover-shadow-sm" onClick={() => navigate("/condiciones")}>
            <div className="card-body position-relative">
              <div className="position-absolute" style={{ top: "-13px" }}>
                <Badge
                  color={convocatoria.tipo_cond.toLocaleLowerCase() === "institucional" ? "success" : "primary"}
                  pill
                  className="text-uppercase px-3"
                >
                  {convocatoria.tipo_cond}
                </Badge>
              </div>
              <div className="row justify-content-between mt-1">
                <div className="col-12 col-md-6 col-lg-8 mb-4 mb-md-0">
                  <b className="d-block small">Nombre:</b>
                  <span>{convocatoria.nomb_conv}</span>
                </div>
                <div className="col">
                  <div className="d-flex gap-4 justify-content-between justify-content-sm-start justify-content-md-between">
                    <div className="d-block">
                      <b className="small">Apertura:</b>
                      <span className="d-block">{convocatoria.fech_ini}</span>
                    </div>
                    <div className="d-block">
                      <b className="small">Cierre:</b>
                      <span className="d-block">{convocatoria.fech_fin}</span>
                    </div>
                    <div className="d-block">
                      <b className="small">Estado:</b>
                      <span className="d-block">{convocatoria.est_conv}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Convocatorias;
