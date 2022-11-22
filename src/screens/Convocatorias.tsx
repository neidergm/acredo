
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { SubHeader } from "../components/SubHeader";
import { Badge } from 'reactstrap';

const convocatorias = [
  {
    nombre: "Convocatoria 1",
    fecha: "10-10-2022",
    fecha_cierre: "01-09-2023",
    tipo: "Institucional",
    estado: "Abierto",
  },
  {
    nombre: "Convocatoria 2",
    fecha: "01-09-2022",
    fecha_cierre: "01-09-2022",
    tipo: "Programas",
    estado: "Cerrado",
  },
  {
    nombre: "Convocatoria 3",
    fecha: "13-11-2022",
    fecha_cierre: "01-09-2022",
    tipo: "Institucional",
    estado: "Cerrado",
  },
  {
    nombre: "Convocatoria 4",
    fecha: "11-12-2022",
    fecha_cierre: "01-09-2022",
    tipo: "Institucional",
    estado: "Cerrado",
  },
];

const Convocatorias = () => {

  const navigate = useNavigate();

  return (
    <>
      <Header />
      <SubHeader text={'Convocatorias'} />
      <div className="container pt-4">
        {convocatorias.map((convocatoria) => (
          <div className="card mb-4 border-0 bg-light hover-scale-up hover-shadow-sm" onClick={() => navigate("/condiciones")}>
            <div className="card-body position-relative">
              <div className="position-absolute" style={{ top: "-13px" }}>
                <Badge
                  color={convocatoria.tipo.toLocaleLowerCase() === "institucional" ? "success" : "primary"}
                  pill
                  className="text-uppercase px-3"
                >
                  {convocatoria.tipo}
                </Badge>
              </div>
              <div className="row justify-content-between mt-1">
                <div className="col-12 col-md-6 col-lg-8 mb-4 mb-md-0">
                  <b className="d-block small">Nombre:</b>
                  <span>{convocatoria.nombre}</span>
                </div>
                <div className="col">
                  <div className="d-flex gap-4 justify-content-between justify-content-sm-start justify-content-md-between">
                    <div className="d-block">
                      <b className="small">Apertura:</b>
                      <span className="d-block">{convocatoria.fecha}</span>
                    </div>
                    <div className="d-block">
                      <b className="small">Cierre:</b>
                      <span className="d-block">{convocatoria.fecha_cierre}</span>
                    </div>
                    <div className="d-block">
                      <b className="small">Estado:</b>
                      <span className="d-block">{convocatoria.estado}</span>
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
