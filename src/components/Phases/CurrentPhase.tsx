import { useState, useMemo } from 'react'
import { Badge, Button, DropdownToggle } from 'reactstrap';
import { getDateDiff, getNormalDate } from '../../utils/dateUtils';
import CircleProgress from '../CircleProgress';
import classnames from 'classnames';
import Alert, { I_AlertObject } from '../Alert';
import { useAppSelector } from '../../hooks/useAppSelector';
import Loader from '../Loader';
import { ArrowCounterclockwise, Check, ExclamationCircleFill, UiChecks } from '../Icons';
import { AXIOS_REQUEST } from '../../services/axiosService';
import { PUT_ACTION, UPDATE_TASK } from '../../services/endPointsService';
import { jsonToFormData } from '../../utils/formUtils';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getPhasesAndStagesOfCondition, selectCondition, setProcessPhasesWithConditions } from '../../store/actions/conditionsActions';
import { selectProcess } from '../../store/actions/processActions';
import { isAdmin, isLead, isOnlyView, isSupervisor } from '../../utils/userRolUtils';
import { I_Condition } from '../../interfaces/conditions.interface';
import { toast } from 'react-hot-toast';
import CustomDropdown from '../CustomDropdown';
import { closeModal } from '../Modal';
import useLoader from '../../hooks/useLoader';

type T_Props = {
    taskProgress: number,
    callback?: () => void,
    togglePhases?: () => void,
    processId: number,
    task: I_Condition
};

const CurrentPhase = ({
    taskProgress,
    togglePhases,
    callback,
    processId,
    task
}: T_Props) => {
    const dispatch = useAppDispatch();
    const { active, phases } = useAppSelector(state => state.conditions.selectedData);
    const { action, phase, stage } = active || {};

    const userRol = useAppSelector(state => state.user.userInfo?.rol)
    const taskIsEnded = task?.id_esta === 3;

    const [canEndAction, canEndTask] = useMemo(() => {
        const onlyView = isOnlyView(task?.rol);
        const is_admin = isAdmin(userRol);
        const is_supervisor = isSupervisor(userRol);
        const is_lead = isLead(task?.rol);

        return [
            !taskIsEnded && !is_supervisor && !onlyView && ((is_admin || is_lead) || !!(active?.action?.finalizar)),
            !is_supervisor && (is_admin || is_lead)
        ]
    }, [active?.action?.finalizar, task?.rol, taskIsEnded, userRol]);


    const [_alert, setAlert] = useState<null | I_AlertObject>(null);
    const { loading, openLoader, closeLoader } = useLoader();

    const dateDiff = getDateDiff(new Date(action?.fecha_accion || ""));
    const expiredDate = dateDiff < 0;

    const completeAction = () => {
        openLoader("Finalizando acción");

        AXIOS_REQUEST(PUT_ACTION, "PUT", jsonToFormData({
            est_accion: 2,
            id_accion: active!.action!.id_accion
        }, "[0].")
        ).then(() => {
            closeModal(setAlert)
            toast.success("Se ha finalizado la acción correctamente", { position: "top-right" });
            dispatch(setProcessPhasesWithConditions(processId, null))
            dispatch(selectCondition(null));
            dispatch(selectProcess(null));
            dispatch(getPhasesAndStagesOfCondition(task.id_cond));
            callback?.();
        }).catch(() => {
            setAlert({
                type: "error",
                title: "Ops...",
                subtitle: "No se pudo marcar la acción como finalizada, por favor intente nuevamente",
                isOpen: true,
                closeButton: { value: "Ok" }
            })
        }).finally(() => closeLoader())
    }

    const undoCompleteTask = () => {
        openLoader("Espere");
        AXIOS_REQUEST(UPDATE_TASK, "PUT", jsonToFormData({
            id_esta: 2,
            id_cond: task.id_cond
        })
        ).then(() => {
            toast.success("Se ha desmarcado la tarea correctamente", { position: "top-right" });
            closeLoader(()=>{
                closeModal(setAlert)
                callback?.();
            })
            dispatch(setProcessPhasesWithConditions(processId, null))
            dispatch(selectCondition(null));
            dispatch(selectProcess(null));
            dispatch(getPhasesAndStagesOfCondition(task.id_cond));
        }).catch(() => {
            setAlert({
                type: "error",
                title: "Ops...",
                subtitle: "No se pudo marcar la tarea como finalizada, por favor intente nuevamente",
                isOpen: true,
                closeButton: { value: "Ok" }
            })
        }).finally(() => closeLoader())
    }

    const completeTask = () => {
        openLoader("Finalizando tarea");
        AXIOS_REQUEST(UPDATE_TASK, "PUT", jsonToFormData({
            id_esta: 3,
            id_cond: task.id_cond
        })
        ).then(() => {
            closeLoader(()=>{
                closeModal(setAlert)
                callback?.();
            })
            toast.success("Se ha finalizado la tarea correctamente", { position: "top-right" });
            dispatch(setProcessPhasesWithConditions(processId, null))
            dispatch(selectCondition(null));
            dispatch(selectProcess(null));
            dispatch(getPhasesAndStagesOfCondition(task.id_cond));
        }).catch(() => {
            setAlert({
                type: "error",
                title: "Ops...",
                subtitle: "No se pudo marcar la tarea como finalizada, por favor intente nuevamente",
                isOpen: true,
                closeButton: { value: "Ok" }
            })
        }).finally(() => closeLoader())
    }

    const markActionAsCompleted = () => {
        if (task.form_cond.length === 0) return cantEndTaskOrAction()

        setAlert({
            isOpen: true,
            title: "¿Está seguro?",
            subtitle: "La acción quedará marcada como finalizada",
            type: "question",
            submitButton: {
                value: "Sí, finalizar",
                onClick: completeAction
            },
            closeButton: { value: "No, cancelar" }
        })
    }

    const markTaskAsCompleted = (warning?: boolean) => {
        if (task.form_cond.length === 0) return cantEndTaskOrAction()

        setAlert({
            isOpen: true,
            title: "¿Está seguro?",
            subtitle: "La tarea se dará por terminada, se quitarán los permisos a los responsables y no se podrá realizar ninguna clase de modificaciones",
            type: warning ? "warning" : "question",
            submitButton: {
                value: "Sí, continuar",
                onClick: completeTask
            },
            closeButton: { value: "No, cancelar" }
        })
    }

    const undoMarkTaskAsCompleted = () => {
        setAlert({
            isOpen: true,
            title: "¿Está seguro?",
            subtitle: "La tarea dejará de estar completada, se restaurarán los permisos a los responsables y se habilitarán las modificaciones",
            type: "warning",
            submitButton: {
                value: "Sí, continuar",
                onClick: undoCompleteTask
            },
            closeButton: { value: "No, cancelar" }
        })
    }

    const cantEndTaskOrAction = () => {
        setAlert({
            isOpen: true,
            title: "Espere",
            subtitle: "No se puede realizar esta acción debido a que no hay formularios asociados a la tarea",
            type: "error",
            closeButton: { value: "Ok" }
        })
    }

    if (!task || !(active)) {
        return <div className='py-5'><Loader isOpen={true} loaderAsModal={false} /></div>
    } else if (!action && phases?.[0]?.stages_completed === 0) {
        return <div className='w-100 h-100 d-flex justify-content-center align-items-center flex-column'>
            <i className='text-warning mb-2'><ExclamationCircleFill size={35} /></i>
            <span className="d-block"> No hay nada para mostar</span>
        </div>
    }

    return (<>
        <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { closeModal(setAlert) }} />
        <Loader {...loading} />
        {
            (taskIsEnded || (!phase && phases?.[0]?.stages?.length === phases?.[0]?.stages_completed)) ?
                <div className='w-100 h-100 d-flex justify-content-center align-items-center flex-column'>
                    {taskIsEnded ?
                        <b className="d-block fw-semibold">Tarea completada</b>
                        :
                        <b className="d-block fw-semibold">¡La tarea está casi completada!</b>
                    }
                    <CircleProgress
                        progress={taskProgress}
                        color={expiredDate ? "#dc3545" : '#198754'}
                        stroke={8}
                        radius={55}
                        content={<b>{taskProgress}%</b>}
                    />
                    <div>
                        {!!(canEndTask) && (
                            taskIsEnded ?
                                <Button onClick={() => undoMarkTaskAsCompleted()} size='sm' color='primary' className='ms-auto' disabled={!(taskProgress)}>
                                    <i className='me-1'><ArrowCounterclockwise /></i>
                                    Desmarcar tarea como completada
                                </Button>
                                :
                                <Button onClick={() => markTaskAsCompleted()} size='sm' color='primary' className='ms-auto' disabled={!(taskProgress)}>
                                    <i className='me-1'><Check /></i>
                                    Marcar tarea como completada
                                </Button>
                        )}
                    </div>
                </div>
                :
                <div className='d-flex flex-column justify-content-between h-100'>
                    <div className='d-flex w-100 align-items-center h-100'>
                        <div className='pe-3 my-auto'>
                            <CircleProgress
                                progress={taskProgress}
                                color={expiredDate ? "#dc3545" : '#198754'}
                                stroke={8}
                                radius={55}
                                content={<b>{taskProgress}%</b>}
                            />
                        </div>
                        <div className='flex-grow-1 small'>
                            <p className="mb-2"><b className='fw-semibold'>Acción:</b> {action?.nomb_accion}</p>
                            <p className="mb-2"><b className='fw-semibold'>Etapa:</b> {stage?.name}</p>
                            <p className="mb-2"><b className='fw-semibold'>Fase:</b> {phase?.name}</p>
                            <p className='mb-0'>
                                <span><b className='fw-semibold'>Fecha límite: </b></span>
                                <span className={classnames({ "text-danger fw-semibold": expiredDate })}>
                                    {getNormalDate(action?.fecha_accion || "", { dateStyle: "long" })}

                                </span>
                                <br />
                                {expiredDate &&
                                    <Badge color='danger' className='opacity-75'>
                                        {dateDiff < 0 ? `Vencido hace ${dateDiff * -1} días` : dateDiff === 0 ? "Vence hoy" : "Vence dentro de " + dateDiff + " días"}
                                    </Badge>
                                }
                            </p>
                        </div>
                    </div>
                    <div className='mt-4 d-flex justify-content-between '>
                        {!!(togglePhases) &&
                            <Button onClick={togglePhases} size='sm' color='link' className='rounded-2 '>Mostrar fases y etapas</Button>
                        }
                        {!!(canEndAction) && <div className='text-end flex-grow-1'>
                            {
                                <CustomDropdown
                                    options={[{ text: "Marcar tarea como completada", click: () => { markTaskAsCompleted(true) }, icon: <UiChecks /> }]}
                                    group={canEndTask}>
                                    <Button onClick={markActionAsCompleted} size='sm' color='primary' className='ms-auto'>
                                        <i className='me-1'><Check /></i>
                                        Finalizar esta acción
                                    </Button>
                                    {canEndTask ? <DropdownToggle
                                        caret
                                        color="primary"
                                        size='sm'
                                    /> : <></>}
                                </CustomDropdown>
                            }
                        </div>
                        }
                    </div>
                </div>
        }
    </>)
}

export default CurrentPhase;
