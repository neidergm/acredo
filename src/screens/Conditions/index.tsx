import { useState, useEffect } from "react";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { CONDITIONS_BY_CONVOCATORY } from "../../services/endPointsService";
import { SubHeader } from "../../components/SubHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { I_Condition } from "../../interfaces/conditions.interface";
import { I_Convocatory } from "../../interfaces/convocatory.interface";
import { Badge } from "reactstrap";
import Loader from "../../components/Loader";

let DATA: { [id_conv: string]: Array<I_Condition> } = {};

const Conditions = () => {

  const { dependency } = useParams();
  const selectedConvocatory: I_Convocatory = useLocation().state;
  const navigate = useNavigate();

  const [conditions, setConditions] = useState<Array<I_Condition> | null>(null);

  const goToConditionDetailsScreen = (condition: I_Condition) => {
    navigate(`/condiciones/detalles/${condition.id_cond}`, { state: { condition, convocatory: selectedConvocatory } })
  }

  useEffect(() => {
    if (!dependency) return
    if (!!(DATA[dependency])) {
      setConditions(DATA[dependency])
    } else {
      AXIOS_REQUEST(CONDITIONS_BY_CONVOCATORY + dependency)
        .then(res => {
          setConditions(res.data);
          DATA[dependency] = res.data;
        })
        .catch(err => err)
    }
  }, [])

  return (
    <div className="condiciones-container">
      <SubHeader text={"Condiciones"} showBackButton />

      <div className="container">
        <div className="mb-5">
          <p>
            <b>Convocatoria:</b>
            <span className="d-block">{selectedConvocatory.nomb_conv}</span>
          </p>
        </div>

        <div>
          {!conditions ? <Loader isOpen loaderAsModal={false} />
            :
            !conditions.length ?
              <p>| No hay condiciones registradas en la convocatoria</p>
              :
              conditions.map((item) => (
                <div
                  key={item.id_cond}
                  className="card mb-4 border-0 bg-light hover-scale-up hover-shadow-sm"
                  onClick={() => goToConditionDetailsScreen(item)}
                >
                  <div className="card-body">
                    <div className="d-flex flex-sm-row-reverse justify-content-sm-between flex-column gap-3">
                      <div>
                        <Badge
                          pill
                          color="info"
                          className="px-3"
                        >
                          {item.estado}
                        </Badge>
                      </div>
                      <div>
                        <p className="mb-1">{item.nomb_cond}</p>
                        <p><b>Campus:</b> {item.sede}</p>
                      </div>
                    </div>
                    <p className="card-text">
                      <small className="text-muted">
                        - Última actualización el {new Date(item.marc_update).toLocaleString([], { dateStyle: "long", timeStyle: "short" })}
                      </small>
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Conditions;
