import { useState, useEffect } from 'react';
import { AccordionBody, AccordionHeader, AccordionItem, Badge, Button, Offcanvas, OffcanvasBody, OffcanvasHeader, UncontrolledAccordion } from 'reactstrap';
import { type T_Action, type T_Phase, type T_Stage } from '../../interfaces/phasesAndStages.interface'
import styles from './phases.module.css';
import classnames from 'classnames';
import { CheckCircleFill, Edit, ExclamationCircleFill, Plus } from '../Icons';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import { closeModal, Modal, ModalBody, ModalFooter, ModalHeader, type T_ModalJSON } from '../Modal';

import CreateStage from './Create/CreateStage';
import { useAppSelector } from '../../hooks/useAppSelector';
import Loader from '../Loader';
import TimeLine from './TimeLine';

type T_Props = {
  isAdmin: boolean,
  taskEnded?: boolean
}

const PhasesList = ({ isAdmin, taskEnded }: T_Props) => {

  const [modal, setModal] = useState<T_ModalJSON | null>(null);
  const [selectStage, setSelectStage] = useState<{
    stage: T_Stage,
    phase: T_Phase,
  } | null>(null)

  const [showTimeLine, setShowTimeLine] = useState(false)

  const list = useAppSelector(state => state.conditions.selectedData.phases)
  const active = useAppSelector(state => state.conditions.selectedData.active)

  const showActionDetails = (action: T_Action, stage: T_Stage, phase: T_Phase) => {
    const dateDiff = getDateDiff(new Date(action.fecha_accion));

    setModal({
      isOpen: true,
      size: "lg",
      title: action.nomb_accion,
      footer: <ModalFooter className='justify-content-start'>
        <Button color='primary2' onClick={() => closeModal(setModal)}>Cerrar</Button>
      </ModalFooter>,
      children: <div>
        {action.est_accion === 2 && <div >
          <p className='border-start border-4 ps-2 border-success'>
            <b className='d-block'>Fecha de realización: </b>
            <span>
              {getNormalDate(action.marc_update, { dateStyle: "full", timeStyle: "short" })}
            </span>
          </p>
          {action.usua_finalizar && <p className='border-start border-4 ps-2 border-success'>
            <b className='d-block'>Usuario que finalizó la acción: </b>
            <span>{action.usua_finalizar}</span>
          </p>}
        </div>}
        <p>
          <b className='d-block'>Fecha límite: </b>
          <span>
            {getNormalDate(action.fecha_accion, { dateStyle: "full" })}
            {action.est_accion === 0 ?
              (taskEnded && <Badge className='float-end' pill>No se realizó</Badge>)
              : (action.est_accion === 2 ?
                <Badge pill color='success' className='float-end d-line-block'>Realizada</Badge> :
                <Badge pill color={dateDiff < 0 ? "danger" : "primary"} className='float-end d-line-block'>
                  {dateDiff < 0 ? `Vencido hace ${dateDiff * -1} días` : `Vence ${dateDiff === 0 ? "hoy" : "en " + dateDiff + " días"}`}
                </Badge>)}
          </span>
        </p>
        <p>
          <b className='d-block'>Etapa: </b>
          <span>{stage.name}</span>
        </p>
        <p>
          <b className='d-block'>Fase: </b>
          <span>{phase.name}</span>
        </p>
        <div>
          <b className='d-block'>Responsables: </b>
          <ul>
            {action.usuarios?.map((u, i) => <li key={i} title={u.nomb_cargo}>
              {u.responsable} <small className='text-muted'> | {u.rol_nombre}</small></li>) || <li>Sin responsables</li>}
          </ul>
        </div>
      </div>
    })
  }

  const doStages = (stages: T_Stage[], phase: T_Phase) => {
    return stages.map(item => {
      const key = `stage-${item.id}`;
      return <AccordionItem className={styles.stage} key={key}>
        <div className={classnames('d-flex align-items-center', { 'justify-content-between': isAdmin })}>
          <AccordionHeader targetId={key}
            className={classnames(styles["stage-header"], { "flex-grow-1": !isAdmin })}
            tag="div"
          >
            <span>
              <i className={item.status === 1 ? "text-success" : ""}><CheckCircleFill /></i>
              <span className={item.status === 1 ? "text-black fw-semibold" : ""}>{item.name}</span>
            </span>
          </AccordionHeader>
          {isAdmin && (!(item.actions?.length) || !(item.actions_completed === item.actions?.length)) &&
            <Button color='link' className='pe-0' onClick={() => toggleEditStagePannel(item, phase)}>
              <Edit size={16} />
            </Button>
          }
        </div>
        <AccordionBody accordionId={key} className={styles["stage-body"]} >
          {
            item.actions ?
              item.actions.map((action, idx) => {
                const key = `action-${action.id_accion}`
                return <div key={key}
                  className={classnames(
                    `${styles.action} hover-scale-up`, { [styles.active]: !taskEnded && action.id_accion === active?.action?.id_accion }
                  )}
                  onClick={() => showActionDetails(action, item, phase)}
                >
                  <span>
                    <span className={classnames(
                      'fw-semibold',
                      action.est_accion === 2 ? "bg-success" : "bg-black bg-opacity-25",
                      { "bg-black bg-opacity-50": !taskEnded && action.id_accion === active?.action?.id_accion }
                    )}>
                      {idx + 1}
                    </span>
                  </span>
                  <p>
                    {action.nomb_accion}
                    {action.est_accion !== 2 ?
                      (taskEnded ?
                        <span className='d-block text-muted'>No realizada</span>
                        :
                        <span className='d-block text-muted'>Vence el {getNormalDate(action.fecha_accion, { dateStyle: "long" })}</span>
                      )
                      :
                      <span className='d-block text-muted'>Realizada el {getNormalDate(action.marc_update, { dateStyle: "long", timeStyle: "short" })}</span>
                    }
                  </p>
                </div>
              })
              :
              <p>Sin acciones asignadas</p>
          }
        </AccordionBody>
      </AccordionItem>
    })
  }

  const createNewStage = (phase: T_Phase) => {
    toggleEditStagePannel({} as T_Stage, phase)
  }

  const toggleEditStagePannel = (stage?: T_Stage, phase?: T_Phase) => {
    if (!(stage) || !(phase)) {
      setSelectStage(null)
    } else {
      setSelectStage({ stage, phase })
    }
  }

  const toggleTimeLine = () => setShowTimeLine(t => !t)

  const createStageButton = <div className='mt-3 d-flex justify-content-between'>
    {isAdmin && !!list &&
      <>
        <Button size='sm' color='link' onClick={() => toggleTimeLine()}>
          Línea de tiempo
        </Button>
        <Button color='primary' size='sm' className='ms-auto' onClick={() => createNewStage(list[0])}>
          <i><Plus /></i>
          Crear nueva etapa
        </Button>
      </>
    }
  </div>

  useEffect(() => {
    if ((selectStage)) {
      setSelectStage((c) => {
        const p = list?.find(i => i.id === c!.phase.id);
        return p ? {
          stage: c!.stage.id ? (p.stages || []).find(i => i.id === c!.stage.id)! : (p.stages || []).at(-1)!,
          phase: p
        } : null;
      })
    }
  }, [list])

  if (!(list)) {
    return <div className='mb-3'><Loader loaderAsModal={false} /></div>
  } else if (!(list.length)) {
    return <><div className='w-100 h-100 d-flex justify-content-center align-items-center flex-column mb-5 mt-5'>
      <i className='text-warning mb-2'><ExclamationCircleFill size={35} /></i>
      <span className="d-block"> No hay nada para mostar</span>
    </div>
      {createStageButton}
    </>
  }

  return (
    <>
      <Modal size={modal?.size}
        isOpen={!!(modal?.isOpen)}
        onClosed={() => { setModal(null) }}
        toggle={() => closeModal(setModal)}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>
      <Offcanvas isOpen={!!(selectStage)} style={{ minWidth: "65%" }} fade>
        <OffcanvasHeader toggle={() => toggleEditStagePannel()}>
          <span className='ps-3 border-start border-success border-4 py-1'>{
            selectStage?.stage?.id ? "Modificar etapa" : "Crear nueva etapa"
          }</span>
        </OffcanvasHeader>
        <OffcanvasBody>
          <CreateStage
            stage={selectStage?.stage}
            phase={selectStage?.phase}
            callback={() => toggleEditStagePannel()}
          />
        </OffcanvasBody>
      </Offcanvas>
      <Offcanvas isOpen={showTimeLine} style={{ minWidth: "65%" }} fade>
        <OffcanvasHeader toggle={toggleTimeLine}>
          <span className='ps-3 border-start border-success border-4 py-1'>Línea de tiempo de acciones</span>
        </OffcanvasHeader>
        <OffcanvasBody>
          <TimeLine list={list[0].stages!} canEdit={isAdmin} taskEnded={taskEnded} />
        </OffcanvasBody>
      </Offcanvas>
      {
        list?.map(item => {
          const key = `phase-${item.id}`;
          return <div
            className={classnames(styles.phase)}
            key={key}
          >
            <div className={classnames(styles["phase-body"], "ms-3")}>
              <UncontrolledAccordion stayOpen flush defaultOpen={taskEnded ? [""] : [`stage-${active?.stage?.id}`]} toggle={() => { }}>
                {item.stages ? doStages(item.stages, item) : <p>Sin etapas registradas</p>}
              </UncontrolledAccordion>
            </div>
          </div>
        })
      }
      {createStageButton}
    </>
  )
}

export default PhasesList;
