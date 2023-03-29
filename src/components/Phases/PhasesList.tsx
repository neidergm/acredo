import { useState, useEffect } from 'react';
import { AccordionBody, AccordionHeader, AccordionItem, Badge, Button, DropdownItem, DropdownMenu, DropdownToggle, Offcanvas, OffcanvasBody, OffcanvasHeader, UncontrolledAccordion, UncontrolledDropdown } from 'reactstrap';
import { T_Action, T_Phase, T_Stage } from '../../interfaces/phasesAndStages.interface'
import styles from './phases.module.css';
import classnames from 'classnames';
import { CheckCircleFill, Edit, ExclamationCircleFill, PlusCircleFill, ThreeDotsVertical, XCircle } from '../Icons';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import { closeModal, Modal, ModalBody, ModalHeader, T_ModalJSON } from '../Modal';

import CreateStage from './Create/CreateStage';
import { useAppSelector } from '../../hooks/useAppSelector';
import Loader from '../Loader';

type T_Props = {
  isAdmin: boolean
}

const PhasesList = (
  { isAdmin }: T_Props
) => {

  const [modal, setModal] = useState<T_ModalJSON | null>(null);
  const [selectStage, setSelectStage] = useState<{
    stage: T_Stage,
    phase: T_Phase
  } | null>(null)

  const list = useAppSelector(state => state.conditions.selectedData.phases)
  const active = useAppSelector(state => state.conditions.selectedData.active)

  const showActionDetails = (action: T_Action, stage: T_Stage, phase: T_Phase) => {
    let dateDiff = getDateDiff(new Date(), new Date(action.fecha_accion));

    setModal({
      isOpen: true,
      size: "lg",
      title: action.nomb_accion,
      children: <div>
        <p>
          <b className='d-block'>Responsables: </b>
          <ul>
            {action.usuario?.split(",").map((u, i) => <li key={i}>{u}</li>) || <li>Sin responsables</li>}
          </ul>
        </p>
        {/* <p>
          <b className='d-block'>Rol responsables: </b>
          <span>{action.rol_nombre}</span>
        </p> */}
        <p>
          <b className='d-block'>Fecha límite: </b>
          <span>
            {getNormalDate(action.fecha_accion, { dateStyle: "long" })}
            {action.est_accion === 0 && <Badge pill color={dateDiff < 0 ? "danger" : "primary"} className='float-end d-line-block'>
              {dateDiff < 0 ? `Vencido hace ${dateDiff * -1} días` : `Vence ${dateDiff === 0 ? "hoy" : "en " + dateDiff + " días"}`}
            </Badge>}
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
      </div>
    })
  }

  const doStages = (stages: T_Stage[], phase: T_Phase) => {
    return stages.map(item => {
      let key = `stage-${item.id}`;
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
              item.actions.map(action => {
                let key = `action-${action.id_accion}`
                return <div key={key}
                  className={classnames(
                    `${styles.action} hover-scale-up`, { [styles.active]: action.id_accion === active?.action?.id_accion }
                  )}
                  onClick={() => showActionDetails(action, item, phase)}
                >
                  <span>
                    <span className={classnames(
                      'fw-semibold',
                      action.est_accion === 2 ? "bg-success" : "bg-black bg-opacity-25",
                      { "bg-black bg-opacity-50": action.id_accion === active?.action?.id_accion }
                    )}>
                      {action.orden}
                    </span>
                  </span>
                  <p>
                    {action.nomb_accion}
                    <span className='d-block text-muted'>Vence el {getNormalDate(action.fecha_accion, { dateStyle: "long" })}</span>
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

  const deletePhase = (phase: T_Phase) => {

  }

  const updatePhase = (phase: T_Phase) => {

  }

  const createNewStage = (phase: T_Phase) => {

  }

  const toggleEditStagePannel = (stage?: T_Stage, phase?: T_Phase) => {
    if (!(stage) || !(phase)) {
      setSelectStage(null)
    } else {
      setSelectStage({ stage, phase })
    }
    // setModal({
    //   isOpen: true,
    //   size: "xl",
    //   title: "Modificar etapa",
    //   children: <div>
    //     <Form
    //       defaultValues={{}}
    //       fields={stageForm as T_FieldsTypes[]}
    //       onSubmit={() => { }}
    //     />
    //   </div>
    // })
  }

  useEffect(() => {
    if (!!(selectStage)) {
      setSelectStage((c) => {
        let p = list?.find(i => i.id === c!.phase.id)!;
        return !p ? null : {
          stage: p.stages?.find(i => i.id === c!.stage.id)!,
          phase: p
        }
      })
    }
  }, [list])


  if (!(list)) {
    return <div className='mb-3'><Loader isOpen={true} loaderAsModal={false} /></div>
  } else if (!(list.length)) {
    return <div className='w-100 h-100 d-flex justify-content-center align-items-center flex-column mb-5 mt-5'>
      <i className='text-warning mb-2'><ExclamationCircleFill size={35} /></i>
      <span className="d-block"> No hay nada para mostar</span>
    </div>
  }

  return (
    <>
      <Modal backdrop="static" size={modal?.size}
        isOpen={!!(modal?.isOpen)}
        onClosed={() => { setModal(null) }}
        toggle={() => closeModal(setModal)}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>
      <Offcanvas isOpen={!!(selectStage)} style={{ minWidth: "65%" }}>
        <OffcanvasHeader toggle={() => toggleEditStagePannel()}>
          <span className='ps-3 border-start border-success border-4 py-1'>Modificar etapa</span>
        </OffcanvasHeader>
        <OffcanvasBody>
          <CreateStage
            stage={selectStage?.stage}
          />
        </OffcanvasBody>
      </Offcanvas>
      <UncontrolledAccordion stayOpen flush
        defaultOpen={[`phase-${active?.phase?.id}`]}
        className={classnames({ [styles["is-admin"]]: isAdmin })}
      >
        {
          list?.map(item => {
            let key = `phase-${item.id}`;
            return <AccordionItem
              className={classnames(styles.phase)}
              key={key}
            >
              <div className={classnames('d-flex align-items-center', { 'justify-content-between': isAdmin })}>
                <AccordionHeader targetId={key}
                  className={classnames(styles["phase-header"], { "flex-grow-1": !isAdmin })}
                  tag="div"
                >
                  <span className='flex-grow-1'>
                    {item.stages_completed === item.stages?.length ?
                      <i className='me-2 text-success'><CheckCircleFill /></i> :
                      <i className='me-2'><ExclamationCircleFill /></i>
                    }
                    {item.name}
                  </span>
                </AccordionHeader>
                {isAdmin && !(item.stages_completed === item.stages?.length) && <UncontrolledDropdown>
                  <DropdownToggle size="sm" color='link' className='pe-0'><ThreeDotsVertical /></DropdownToggle>
                  <DropdownMenu className='border shadow-3 rounded-3 mt-1 pb-3'>
                    <DropdownItem header>
                      <p className='mb-2 text-muted opacity-75 small'>Opciones de la fase</p>
                    </DropdownItem>
                    <DropdownItem onClick={() => { createNewStage(item) }}>
                      <div className='d-flex gap-3 text-secondary align-items-center'>
                        <PlusCircleFill size={16} /><span>Crear nueva etapa</span>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => { updatePhase(item) }}>
                      <div className='d-flex gap-3 text-secondary align-items-center'>
                        <Edit size={16} /><span>Modificar fase</span>
                      </div>
                    </DropdownItem>
                    <DropdownItem onClick={() => { deletePhase(item) }}
                      disabled={item.stages_completed !== 0}
                      className={classnames({ "text-mutd opacity-50": item.stages_completed !== 0 })}
                    >
                      <div className='d-flex gap-3 text-secondary align-items-center'>
                        <XCircle size={16} /><span>Eliminar fase</span>
                      </div>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>}
              </div>
              <AccordionBody accordionId={key} className={classnames(styles["phase-body"])}>
                <UncontrolledAccordion stayOpen flush defaultOpen={[`stage-${active?.stage?.id}`]}>
                  {item.stages ? doStages(item.stages, item) : <p>Sin etapas registradas</p>}
                </UncontrolledAccordion>
              </AccordionBody>
            </AccordionItem>
          })
        }
      </UncontrolledAccordion>
    </>
  )
}

export default PhasesList;
