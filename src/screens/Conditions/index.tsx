import { useEffect } from "react";
import { AXIOS_REQUEST } from "../../services/axiosService";
import { CONDITIONS_BY_CONVOCATORY } from "../../services/endPointsService";
import { SubHeader } from "../../components/SubHeader";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { I_Condition } from "../../interfaces/conditions.interface";
import { I_Process } from "../../interfaces/process.interface";
import { Badge } from "reactstrap";
import Loader from "../../components/Loader";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setConditions } from "../../store/actions/conditionsActions";

const Conditions = () => {

  const { id_Process } = useParams();
  const processSelected: I_Process = useLocation().state;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const conditions = useAppSelector(state => state.conditions.list);
  const currentCondition = id_Process ? conditions[id_Process] : null;

  const isInstitutional = processSelected.tipo_cond.toLocaleLowerCase() === "institucional";

  const goToConditionDetailsScreen = (condition: I_Condition) => {
    let type = isInstitutional ? "detalles" : "programa";
    if (!isInstitutional) {
      if (condition.form_cond.split(",").length > 1) type = "programa";
      else type = "detalles";
    }
    navigate(`/condiciones/${type}/${condition.id_cond}`, { state: { condition, process: processSelected } })
  }

  useEffect(() => {
    if (!id_Process) return
    if (!(currentCondition)) {
      AXIOS_REQUEST(CONDITIONS_BY_CONVOCATORY + id_Process)
        .then(res => {
          dispatch(setConditions(id_Process, res.data));
        })
        .catch(err => err)
    }
  }, [])

  return (
    <>
      <SubHeader
        showBackButton
        text={`Condiciones ${isInstitutional ? "intitucionales" : "de programa"}`}
      />
      <div className="container pt-3 pb-5">
        <div className="mb-5">
          <p>
            <b>Proceso:</b>
            <span className="d-block">{processSelected.nomb_conv}</span>
          </p>
          {!isInstitutional && <p className="mb-1">
            <b>Programa:</b>
            <span className="d-block">{processSelected.programa}</span>
          </p>}
        </div>

        <div>
          {!currentCondition ? <Loader isOpen loaderAsModal={false} />
            :
            !currentCondition.length ?
              <p>| No hay condiciones registradas en el proceso</p>
              :
              currentCondition.map((item) => (
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
    </>
  );
};

export default Conditions;
