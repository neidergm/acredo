import { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { InfoCircleFill } from "../../../components/Icons";
import { Button, CloseButton } from 'reactstrap';
import classnames from 'classnames';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, T_ModalJSON } from "../../../components/Modal";
import { SubHeader } from "../../../components/SubHeader";
import { PUT_ACTION } from "../../../services/endPointsService";
import { AXIOS_REQUEST } from "../../../services/axiosService";
import Loader from '../../../components/Loader'
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import Alert, { I_AlertObject } from '../../../components/Alert';
import { CurrentPhase, PhasesList } from '../../../components/Phases';
import FormPannel from './../FormPannel';
import { jsonToFormData } from '../../../utils/formUtils';
import { getProcessList, selectProcess } from '../../../store/actions/processActions';
import Card from '../../../components/Card';
import { getConditionsPhases, getContionData, selectCondition, setProcessPhasesWithConditions, setSelectedConditionData } from '../../../store/actions/conditionsActions';
import { isAdmin, isOnlyView } from '../../../utils/userRolUtils';

const ConditionsDetails = () => {

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id_process, id_cond } = useParams();

  const processSelected = useAppSelector(state => state.process.selected);
  const conditionSelected = useAppSelector(state => state.conditions.selected);

  const [showAllPhases, setShowAllPhases] = useState(true);

  const phases = {
    all: useAppSelector(state => state.conditions.selectedData.phases),
    active: useAppSelector(state => state.conditions.selectedData.active)
  }

  const [_alert, setAlert] = useState<null | I_AlertObject>(null);
  const [loader, setLoader] = useState<null | string>(null);
  const [modalData, setModalData] = useState<T_ModalJSON | null>(null);

  const onlyView = isOnlyView(conditionSelected?.rol);
  const is_admin = isAdmin(useAppSelector(state => state.user.userInfo?.rol));
  const canEndAction = !onlyView;

  const showConditionDetails = () => {
    setModalData({
      isOpen: true,
      title: "Detalles",
      children: <div className=''>
        <div dangerouslySetInnerHTML={{ __html: conditionSelected?.detalle || "" }}></div>
      </div>,
      size: "xl",
      footer: <ModalFooter>
        <Button color="primary" onClick={() => closeModal(setModalData)}>Cerrar</Button>
      </ModalFooter>
    })
  }

  const markStageAsCompleted = () => {
    setLoader("Espere");

    AXIOS_REQUEST(PUT_ACTION, "PUT", jsonToFormData({
      est_accion: 2,
      id_accion: phases.active!.action!.id_accion
    }, "[0]."),
      true
    ).then(() => {
      dispatch(selectProcess(null))
      dispatch(selectCondition(null))
      dispatch(setProcessPhasesWithConditions(Number(id_process), null))

      dispatch(setSelectedConditionData({
        active: null,
        phases: null
      }))

    }).catch(() => {

      setAlert({
        type: "error",
        title: "Ops...",
        subtitle: "No se pudo marcar la acción como finalizada, por favor intente nuevamente",
        isOpen: true,
        closeButton: { value: "Ok" }
      })
    }).finally(() => setLoader(null))
  }

  useEffect(() => {
    if (!id_process || !id_cond) {
      return navigate("/", { replace: true })
    }

    if (!processSelected) {
      dispatch(getProcessList(Number(id_process)))
    } else {
      if (!(conditionSelected)) {
        dispatch(getContionData(Number(id_cond)))
      }
    }
  }, [processSelected])

  useEffect(() => {
    if (!(phases.all?.length)) {
      dispatch(getConditionsPhases(Number(id_cond)))
    }
    return () => {
      dispatch(setSelectedConditionData(null))
    }
  }, []);

  return (
    <>
      <Modal
        isOpen={!!(modalData?.isOpen)}
        onClosed={() => { setModalData(null) }}
        toggle={() => closeModal(setModalData)}
        size={modalData?.size}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModalData)}>{modalData?.title}</ModalHeader>
        <ModalBody>{modalData?.children}</ModalBody>
        {modalData?.footer}
      </Modal>

      <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} />
      <Loader isOpen={!!(loader)} subtitle={loader} />

      <div className="container-fluid container-xxxl">
        <SubHeader
          text={conditionSelected?.nomb_cond ?
            <div className='d-flex gap-3 flex-wrap'>
              {conditionSelected.nomb_cond}
              <Button size='sm' color="primary" className='rounded-pill py-0' outline onClick={() => showConditionDetails()}>
                <span className='d-flex align-items-center pe-2'>
                  <span className='me-1 mb-1'><InfoCircleFill size={16} /></span>Detalles
                </span>
              </Button>
            </div>
            : ""
          }
          showBackButton={true}
        />

        <div className='row'>
          <div className='col-lg-8 mb-4'>
            <Card className='h-100'>
              <div className='d-flex justify-content-between mb-4 align-items-center'>
                <div className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10'
                  style={{ borderRadius: "2px 10px 10px 2px" }}>
                  <small className='fw-bold text-uppercase '>Información</small>
                </div>
              </div>
              {(!processSelected) ?
                <div className='mb-3'><Loader isOpen={true} loaderAsModal={false} /></div>
                :
                <div className='d-flex flex-column gap-3 mb-2'>
                  <div>
                    <b>Proceso:</b>
                    <span className="d-block">{processSelected.nomb_conv}</span>
                  </div>
                  {!!processSelected.programa && <div>
                    <b>Programa:</b>
                    <span className="d-block">{processSelected.programa}</span>
                  </div>}
                  <div className='d-flex gap-3 flex-wrap'>
                    <div>
                      <b>Tipo:</b>
                      <span className="d-block">{processSelected.tipo_cond}</span>
                    </div>
                    <div>
                      <b>Rol:</b>
                      <span className="d-block">Usted tiene el rol de {conditionSelected?.rol_nombre}</span>
                    </div>
                  </div>
                </div>
              }
            </Card>
          </div>
          <div className='col-lg-4 mb-4 col-md-6'>
            <Card className='h-100'>
              <div className='d-flex justify-content-between mb-4 align-items-center'>
                <div className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10'
                  style={{ borderRadius: "2px 10px 10px 2px" }}>
                  <small className='fw-bold text-uppercase '>Estado actual</small>
                </div>
              </div>
              <CurrentPhase
                togglePhases={showAllPhases ? undefined : () => setShowAllPhases(true)}
                callback={canEndAction ? markStageAsCompleted : undefined}
                conditionProgress={conditionSelected?.porcentaje || 0}
              />
            </Card>
          </div>
          <div className={classnames('mb-4 order-3 order-lg-2', showAllPhases ? "col-lg-8" : "col-lg-12")}>
            <Card className='h-100'>
              {(!conditionSelected) ?
                <div className='mt-4 pt-2'><Loader isOpen={true} loaderAsModal={false} /></div>
                :
                <FormPannel formId={conditionSelected.form_cond} canEdit={!onlyView} />
              }
            </Card>
          </div>
          <div className={classnames('col-md-6 mb-4 order-2 order-lg-3', showAllPhases ? "col-lg-4" : "d-none")}>
            <div>
              <Card>
                <div className='d-flex justify-content-between mb-4 align-items-center'>
                  <div className='border-start border-5 border-dark py-1 ps-3 pe-4 bg-secondary bg-opacity-10'
                    style={{ borderRadius: "2px 10px 10px 2px" }}>
                    <small className='fw-bold text-uppercase '>Fases y etapas</small>
                  </div>
                  <CloseButton onClick={() => setShowAllPhases(false)} />
                </div>
                <div className='mb-3'>
                  <PhasesList isAdmin={is_admin} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConditionsDetails;
