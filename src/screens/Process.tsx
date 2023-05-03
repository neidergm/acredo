import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { SubHeader } from "../components/SubHeader";
import { Badge, Button, DropdownToggle } from 'reactstrap';
import Loader from '../components/Loader';
import { I_Process } from '../interfaces/process.interface';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { getProcessList, selectProcess, setProcessList } from '../store/actions/processActions';
import CircleProgress from '../components/CircleProgress';
import Card from '../components/Card';
import { Edit, ExclamationCircleFill, Folder2Open, People, Plus, ThreeDotsVertical, XCircle } from '../components/Icons';
import { Modal, ModalBody, ModalHeader, T_ModalJSON, closeModal, ModalFooter } from '../components/Modal';
import processForm from './../forms/process.form';
import Form from 'react-ngm-form';
import Alert, { I_AlertObject } from '../components/Alert';
import { AXIOS_REQUEST } from '../services/axiosService';
import { CREATE_PROCESS, DELETE_PROCESS, UPDATE_PROCESS } from '../services/endPointsService';
import { Toaster, toast } from 'react-hot-toast';
import { getDifferenceBetweenData, jsonToFormData } from '../utils/formUtils';
import { isAdmin } from '../utils/userRolUtils';
import CustomDropdown from '../components/CustomDropdown';
import { I_JSONObject } from '../interfaces/generic.interface';
import confirmDeleteAlertObject from '../utils/confirmDeleteAlertObject';

const Process = () => {

  const navigate = useNavigate();
  const processList = useAppSelector(state => state.process.list);
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.user.userInfo);
  const [modal, setModal] = useState<null | T_ModalJSON>(null);
  const [loading, setLoading] = useState<null | string>(null);
  const [alert, setAlert] = useState<I_AlertObject | null>(null);

  const is_admin = isAdmin(userInfo?.rol)

  const goToConditionsScreen = (process: I_Process) => {
    dispatch(selectProcess(process));
    navigate(`/proceso/${process.id_conv}`);
  }

  const modalToCreateNewProcess = () => {
    const fields = processForm;
    const FORMID = "CREATE-PROCESS";
    setModal({
      isOpen: true,
      size: "lg",
      title: "Crear nuevo proceso",
      children: <>
        <Form
          formProps={{ id: FORMID }}
          fields={fields}
          defaultValues={{}}
          onSubmit={createNewProces}
        />
      </>,
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary' className="opacity-75 rounded-2">Cancelar</Button>
        <Button color='primary' className="opacity-75 rounded-2" form={FORMID}>Continuar</Button>
      </ModalFooter>
    })
  }

  const modalToEditProcess = (process: I_Process) => {
    const fields = processForm.map(i => ({ ...i }));
    const FORMID = "EDIT-PROCESS";
    const defaultData = {
      nomb_conv: process.nomb_conv,
      id_tcond: process.id_tcond.toString(),
      id_sede: process.id_sede.toString(),
      id_prog: process.id_prog?.toString()
    }
    setModal({
      isOpen: true,
      size: "lg",
      title: "Modificar proceso",
      children: <>
        <Form
          formProps={{ id: FORMID }}
          fields={fields}
          defaultValues={defaultData}
          onSubmit={data => editProcess(process, data, defaultData)}
        />
      </>,
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary' className="opacity-75 rounded-2">Cancelar</Button>
        <Button color='primary' className="opacity-75 rounded-2" form={FORMID}>Continuar</Button>
      </ModalFooter>
    })
  }

  const confirmDeleteProcess = (process: I_Process) => {
    if (!!(process.porcentaje)) {
      return setAlert({
        type: "warning",
        "title": "Espere",
        isOpen: true,
        closeButton: { value: "Ok" },
        subtitle: "Este proceso no puede ser eliminado debido a que cuenta con un progreso"
      })
    }

    setAlert({
      needFillConfirmation: true,
      ...confirmDeleteAlertObject("Se eliminará el proceso con todo lo que se incluye en el mismo",
        () => {
          deleteProcess(process);
          closeModal(setAlert)
        },
        setAlert)
    })
  }

  const deleteProcess = (process: I_Process) => {
    setLoading("Eliminando proceso")
    AXIOS_REQUEST(DELETE_PROCESS + process.id_conv, "DELETE").then(r => {
      dispatch(setProcessList(null))
      toast.success("Se ha eliminado el proceso correctamente", { position: "top-right" })
    }).catch(() => {
      toast.error("No se pudo eliminar el proceso", { position: "top-right" })
    }).finally(() => setLoading(null))
  }

  const editProcess = (process: I_Process, data: I_JSONObject, defaultData: I_JSONObject) => {
    data = getDifferenceBetweenData(defaultData, data);
    if (!Object.values(data).length) {
      return toast.error("No hay modificaciones para guardar", {
        icon: <i className='text-warning'><ExclamationCircleFill /></i>,
        position: "top-right"
      })
    }
    setAlert({
      type: "question",
      title: "¿Está seguro?",
      subtitle: "Se modificarán datos en el proceso",
      isOpen: true,
      submitButton: {
        value: "Si, modificar", onClick: () => {
          setLoading("Modificando proceso");

          let d = jsonToFormData({ id_conv: process.id_conv, ...data });
          AXIOS_REQUEST(UPDATE_PROCESS, "PUT", d, true)
            .then(r => {
              dispatch(setProcessList(null))
              closeModal(setModal);
              toast.success("Se ha modificado el proceso correctamente", { position: "top-right" })
            }).catch(() => {
              toast.error("No se pudo modificar el proceso", { position: "top-right" })
            }).finally(() => setLoading(null))
        }
      },
      closeButton: { value: "No, cancelar" }
    })
  }

  const createNewProces = (data: any) => {
    setAlert({
      type: "question",
      title: "¿Está seguro?",
      subtitle: "Se creará un nuevo proceso con los datos indicados",
      isOpen: true,
      submitButton: {
        value: "Si, crear", onClick: () => {
          setLoading("Creando proceso");

          let d = jsonToFormData(data);

          AXIOS_REQUEST(CREATE_PROCESS, "POST", d, true)
            .then(r => {
              dispatch(setProcessList(null))
              closeModal(setModal);
              toast.success("Se ha creado el proceso correctamente", { position: "top-right" })
            }).catch(() => {
              toast.error("No se pudo crear el proceso", { position: "top-right" })
            }).finally(() => setLoading(null))
        }
      },
      closeButton: { value: "No, cancelar" }
    })
  }

  const showUsers = () => {

  }

  useEffect(() => {
    if (!(processList?.length)) {
      dispatch(getProcessList())
    }
  }, [processList])

  return (
    <>
      <SubHeader text={'Procesos'} className="container">
        <div className='d-flex align-items-center'>
          {is_admin && <Button color='primary' size='sm' className='opacity-75 rounded-2' onClick={modalToCreateNewProcess}>
            <i><Plus /></i>
            Crear nuevo proceso
          </Button>}
        </div>
      </SubHeader>
      <Modal backdrop="static"
        size={modal?.size}
        isOpen={!!(modal?.isOpen)}
        onClosed={() => { setModal(null) }}
        toggle={() => closeModal(setModal)}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>
      <Alert isOpen={!!(alert?.isOpen)}{...alert} onClosed={() => { setAlert(null) }} />

      <Loader isOpen={!!loading} subtitle={loading} />
      <Toaster />
      <div className="container pt-3 pb-5">
        {!(processList) ?
          <Loader loaderAsModal={false} isOpen />
          :
          !(processList.length) ? <div className='mt-5 pt-5 text-center'>
            <h3 className='text-muted opacity-25 mt-5 mb-5'>
              <span className='my-4 d-block'><Folder2Open size={50} /></span>
              No hay nada para mostrar
            </h3>
          </div>
            :
            processList.map(process => (
              // <Card className='mb-4 hover-scale-up flex-md-row gap-3 cursor' key={process.id_conv} style={{ cursor: "auto" }}>
              <Card className='mb-4 hover-scale-up flex-row gap-3 cursor' key={process.id_conv} style={{ cursor: "auto" }}>
                <div onClick={() => goToConditionsScreen(process)} className='flex-grow-1 cursor-pointer'>
                  <div className="position-absolute" style={{ top: "-13px" }}>
                    <Badge
                      color="warning"
                      pill
                      className="text-uppercase px-3"
                    >
                      {process.tipo_cond}
                    </Badge>
                  </div>
                  <div className="gap-3 d-flex flex-column flex-md-row">
                    <div className="flex-grow-1">
                      <div className='mb-3'>
                        <b className="d-block small">Nombre:</b>
                        <span>{process.nomb_conv}</span>
                      </div>
                      <div className='d-flex gap-3 flex-wrap'>
                        <div>
                          <b className="d-block small">Sede:</b>
                          <span>{process.sede}</span>
                        </div>
                        {!!(process.id_prog) && <div>
                          <b className="d-block small">Programa:</b>
                          <span>{process.programa}</span>
                        </div>
                        }
                        {!!(process.fase_actual) && <div>
                          <b className="d-block small">Fase actual:</b>
                          <span>{process.fase_actual}</span>
                        </div>
                        }
                      </div>
                    </div>
                    <div className='text-md-center d-flex flex-md-column justify-content-between'>
                      <div className='mb-2'>
                        <b className="small">Estado:</b>
                        <span className="d-block small">{process.est_conv === 1 ? "ABIERTA" : "CERRADA"}</span>
                      </div>
                      <div>
                        <CircleProgress
                          progress={process.porcentaje || 0}
                          stroke={4}
                          radius={32}
                          color={process.porcentaje >= 100 ? "#0d6efd" : undefined}
                          content={`${process.porcentaje || 0}%`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {is_admin && <div className='text-end'>
                  <CustomDropdown options={[
                    { text: "Ver usuarios", icon: <People size={16} />, click: () => { } },
                    { text: "Modificar proceso", icon: <Edit size={16} />, click: () => modalToEditProcess(process) },
                    { text: "Eliminar proceso", icon: <XCircle size={16} />, click: () => confirmDeleteProcess(process) },
                  ]}>
                    <DropdownToggle size="sm" color='light' className='rounded-3'>
                      <ThreeDotsVertical size={18} />
                    </DropdownToggle>
                  </CustomDropdown>
                </div>}
              </Card>
            ))
        }
      </div>
    </>
  );
};

export default Process;
