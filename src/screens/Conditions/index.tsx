import React, { useState, useEffect } from "react";
import Header from "../../components/header";
import 'bootstrap/dist/css/bootstrap.min.css';
import { AXIOS_REQUEST } from "../../services/axiosService";
import { CONDITIONS_BY_CONVOCATORY } from "../../services/endPointsService";
import { SubHeader } from "../../components/SubHeader";

let DATA: Array<any> = [];

const Conditions = () => {


 //queda para consumir el dia de jueves

  const [convocatorias, setConvocatorias] = useState<typeof DATA>(DATA);

  useEffect(() => {
    !DATA.length && AXIOS_REQUEST(CONDITIONS_BY_CONVOCATORY)
      .then(res => {
        setConvocatorias(res.data)
      })
      .catch(err => err)

    return () => {
      DATA = convocatorias;
    }

  }, [])

  // State for current active Tab
  const [currentActiveTab, setCurrentActiveTab] = useState('1');

  // Toggle active state for Tab
  const toggle = (tab: any) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  }

  return (
    <div className="condiciones-container">
      <Header />
      <SubHeader text={"Condiciones"} showBackButton />

      <div className="container">
        <div className="mb-5">
          <p>
            <b>Convocatoria:</b>
            <span className="d-block">MECANISMOS DE SELECCIÓN Y EVALUACIÓN DE ESTUDIANTES Y PROFESORES</span>
          </p>
        </div>

        <div>
          <div>
            {/*{condiciones.map((item) => (
              <div
                className="card mb-4 border-0 bg-light hover-scale-up hover-shadow-sm"
                onClick={() => navigate(`/condiciones/detalles/${item.ciudad}/${item.codigo}`)}
              >
                <div className="card-body">
                 
                  <div className="d-flex flex-sm-row-reverse justify-content-sm-between flex-column gap-3">
                    <div>
                      <Badge
                        pill
                        color="info"
                        className="px-3"
                      >
                        ESTADO
                      </Badge>
                    </div>
                    <div>
                      <p className="mb-1">{item.condicion}</p>
                      <p><b>Ciudad:</b> {item.ciudad}</p>
                    </div>
                  </div>
                  <p className="card-text"><small className="text-muted">- Última actualización {"00-00-0000 a las 00:00"}</small></p>
                </div>
              </div>
            ))}
             <Row>
              <Col sm="12">
                <table className="table table-striped border mt-4 ">
                  <thead>
                    <tr>
                      <th className="text-center">Codigo</th>
                      <th>Nombre</th>
                      <th>Ultima modificacion</th>
                      <th>Sede</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {condiciones.map((item) => (
                      <tr>
                        <td className="text-center">{item.codigo}</td>
                        <td>{item.condicion}</td>
                        <td>00/00/0000 a las 00:00</td>
                        <td>{item.ciudad}</td>
                        <td>{item.estado !== 'no' ? 'Verificado' : 'Pendiente'}</td>
                        <td>
                          <Link to={'/condiciones/detalles/' + item.ciudad + '/' + item.codigo}>ver</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Col>
            </Row> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conditions;
