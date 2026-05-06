import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from "react-router";
import { SubHeader } from "../components/SubHeader";
import { Badge, Button, DropdownToggle, Input } from 'reactstrap';
import Loader from '../components/Loader';
import { type I_Process } from '../interfaces/process.interface';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { getProcessList, selectProcess, setProcessList } from '../store/slices/processSlice';
import CircleProgress from '../components/CircleProgress';
import Card from '../components/Card';
import { BsPencilSquare, BsExclamationCircleFill, BsFolder2Open, BsPlus, BsThreeDotsVertical, BsXCircle } from 'react-icons/bs';
import { Modal, ModalBody, ModalHeader, type T_ModalJSON, closeModal, ModalFooter } from '../components/Modal';
import Alert from '../components/Alert';
import { AXIOS_REQUEST } from '../services/axiosService';
import { CREATE_PROCESS, DELETE_PROCESS, GET_PROCESS_BY_STATE, UPDATE_PROCESS } from '../services/endPointsService';
import { toast } from 'react-hot-toast';
import { getDifferenceBetweenData, jsonToFormData } from '../utils/formUtils';
import { isAdmin, isSupervisor } from '../utils/userRolUtils';
import CustomDropdown from '../components/CustomDropdown';
import { type I_JSONObject } from '../interfaces/generic.interface';
import confirmDeleteAlertObject from '../utils/confirmDeleteAlertObject';
import ProcessForm from '../forms/ProcessForm';
import useLoader from '../hooks/useLoader';
import useAlert from '../hooks/useAlert';
import { getNormalDate } from '../utils/dateUtils';
import { sessionStorageService } from '../services/localStorageService';
import { SELECT_PROCESS_TYPE_FILTER } from '../services/constantsService';

let timeout: ReturnType<typeof setTimeout>;

const Process = () => {

  const navigate = useNavigate();
  const processList = useAppSelector(state => state.process.list);
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector(state => state.user.userInfo);
  const [modal, setModal] = useState<null | T_ModalJSON>(null);

  const [search, setSearch] = useState("")

  const { alertData, openAlert, closeAlert } = useAlert()
  const { closeLoader, openLoader } = useLoader()
  const is_admin = !isSupervisor(userInfo?.rol) && isAdmin(userInfo?.rol)

  const SELECTED_FILTER_VALUE = useMemo(() => sessionStorageService.getItem(SELECT_PROCESS_TYPE_FILTER) || "", [processList])

  const goToConditionsScreen = (process: I_Process) => {
    dispatch(selectProcess(process));
    let link = `/proceso/${process.id_conv}`;
    if (SELECTED_FILTER_VALUE) link += `?status=${SELECTED_FILTER_VALUE}`;
    navigate(link);
  }

  const modalToCreateNewProcess = () => {
    const FORMID = "CREATE-PROCESS";
    setModal({
      isOpen: true,
      size: "lg",
      title: "Crear nuevo proceso",
      children: <>
        <ProcessForm
          formProps={{ id: FORMID }}
          defaultValues={{}}
          onSubmit={createNewProces}
        />
      </>,
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary2' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button color='primary' form={FORMID}>Continuar</Button>
      </ModalFooter>
    })
  }

  const modalToEditProcess = (process: I_Process) => {
    // const fields = processForm.map(i => ({ ...i }));
    const FORMID = "EDIT-PROCESS";
    const defaultData = {
      nomb_conv: process.nomb_conv,
      id_tcond: process.id_tcond.toString(),
      id_sede: process.id_sede.toString(),
      id_prog: process.id_prog?.toString(),
      coment_conv: process.coment_conv
    }
    setModal({
      isOpen: true,
      size: "lg",
      title: "Modificar proceso",
      children: <>
        <ProcessForm
          formProps={{ id: FORMID }}
          defaultValues={defaultData}
          onSubmit={(data) => editProcess(process, data, defaultData)}
        />
      </>,
      footer: <ModalFooter className='justify-content-between'>
        <Button color='primary2' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button color='primary' form={FORMID}>Continuar</Button>
      </ModalFooter>
    })
  }

  const confirmDeleteProcess = (process: I_Process) => {
    if (!(process.porcentaje) === false) {
      return openAlert({
        type: "warning",
        title: "Espere",
        closeButton: { value: "Ok" },
        children: "Este proceso no puede ser eliminado debido a que cuenta con un progreso"
      })
    }

    openAlert(confirmDeleteAlertObject("Se eliminará el proceso con todo lo que se incluye en el mismo",
      {
        onClick: () => closeAlert(() => deleteProcess(process))
      }
    ))
  }

  const deleteProcess = (process: I_Process) => {
    openLoader("Eliminando proceso")
    AXIOS_REQUEST(DELETE_PROCESS + process.id_conv, "DELETE").then(_r => {
      openLoader("Actualizando listado", null)
      dispatch(getProcessList()).then(() => { closeModal(setModal); closeLoader() })
      toast.success("Se ha eliminado el proceso correctamente", { position: "top-right" })
    }).catch(() => {
      closeLoader()
      toast.error("No se pudo eliminar el proceso", { position: "top-right" })
    })
  }

  const editProcess = (process: I_Process, data: I_JSONObject, defaultData: I_JSONObject) => {
    data = getDifferenceBetweenData(defaultData, data);
    if (!Object.values(data).length) {
      return toast.error("No hay modificaciones para guardar", {
        icon: <i className='text-warning'><BsExclamationCircleFill /></i>,
        position: "top-right"
      })
    }
    openAlert({
      type: "question",
      title: "¿Está seguro?",
      children: "Se modificarán datos en el proceso",
      submitButton: {
        value: "Si, modificar", onClick: () => {
          openLoader("Modificando proceso", () => {
            const d = jsonToFormData({ id_conv: process.id_conv, ...data });
            AXIOS_REQUEST(UPDATE_PROCESS, "PUT", d).then(_r => {
              toast.success("Se ha modificado el proceso correctamente", { position: "top-right" })
              openLoader("Actualizando listado", null)
              dispatch(getProcessList()).then(() => { closeModal(setModal); closeLoader() })
            }).catch(() => {
              closeLoader();
              toast.error("No se pudo modificar el proceso", { position: "top-right" })
            })
          });
        }
      },
      closeButton: { value: "No, cancelar" }
    })
  }

  const createNewProces = (data: I_JSONObject) => {
    openAlert({
      type: "question",
      title: "¿Está seguro?",
      children: "Se creará un nuevo proceso con los datos indicados",
      submitButton: {
        value: "Si, crear", onClick: () => {
          openLoader("Creando proceso", () => {
            const d = jsonToFormData(data);
            AXIOS_REQUEST(CREATE_PROCESS, "POST", d)
              .then(_r => {
                toast.success("Se ha creado el proceso correctamente", { position: "top-right" })
                openLoader("Actualizando listado", null)
                dispatch(getProcessList()).then(() => { closeModal(setModal); closeLoader() })
              }).catch(() => {
                closeLoader()
                toast.error("No se pudo crear el proceso", { position: "top-right" })
              })
          })
        }
      },
      closeButton: { value: "No, cancelar" }
    })
  }

  const filterListByState = (value: string) => {
    sessionStorageService.setItem(SELECT_PROCESS_TYPE_FILTER, value);
    dispatch(setProcessList(null));
    if (value) {
      AXIOS_REQUEST(`${GET_PROCESS_BY_STATE}${value}`).then(resp => {
        dispatch(setProcessList(resp.data));
      })
    } else {
      dispatch(getProcessList())
    }
  }

  const filterListByText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (timeout) clearInterval(timeout)

    timeout = setTimeout(() => {
      setSearch(val)
    }, 500)
  }

  useEffect(() => {
    // if (!(processList?.length) && !hasLoaded.current) {
    filterListByState(SELECTED_FILTER_VALUE)
  }, [])

  return (
    <>
      <SubHeader text={'Procesos'} className="container-xxl">
        <div className='d-flex align-items-center'>
          {/* {is_admin && <Button color='primary' size='sm' className='opacity-75 rounded-2' onClick={modalToCreateNewProcess}> */}
          {is_admin && <Button color='primary' size='sm' onClick={modalToCreateNewProcess}>
            <i><BsPlus /></i>
            Crear nuevo proceso
          </Button>}
        </div>
      </SubHeader>
      <Modal backdrop="static"
        size={modal?.size}
        isOpen={!!(modal?.isOpen)}
        onClosed={() => { modal?.onClosed?.() }}
        toggle={() => closeModal(setModal)}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>
      <Alert {...alertData} />

      <div className="container-fluid container-xxl">
        {!(processList) ?
          <Loader loaderAsModal={false} isOpen />
          :
          <>
            <div className='mb-4 pb-2 d-flex justify-content-between'>
              <div>
                {!!processList.length && <Input className='w-auto border-0' placeholder='Buscar...' type='search' onChange={filterListByText} />}
              </div>
              <div>
                <Input className='w-auto border-0 text-primary text-opacity-75' type='select' defaultValue={SELECTED_FILTER_VALUE} onChange={e => filterListByState(e.target.value)}>
                  <option value="">Procesos abiertos</option>
                  <option value="Terminados">Procesos finalizados</option>
                  {/* <option value="3">Procesos eliminados</option> */}
                </Input>
              </div>
            </div>
            {!(processList.length) ? <div className='mt-5 pt-5 text-center'>
              <h3 className='text-muted opacity-25 mt-5 mb-5'>
                <span className='my-4 d-block'><BsFolder2Open size={50} /></span>
                No hay nada para mostrar
              </h3>
            </div>
              :
              processList.filter(p => new RegExp(`${search.trim()}`, "gi").test(`${p.nomb_conv} ${p.cod_snies} ${p.sede} ${p.programa}`))
                .map(process => (
                  // <Card className='mb-4 hover-scale-up flex-md-row gap-3 cursor' key={process.id_conv} style={{ cursor: "auto" }}>
                  <Card className='ps-2 pe-2 px-sm-3 px-lg-4 mb-4 hover-scale-up gap-1 cursor position-relative'
                    key={process.id_conv}
                    style={{ cursor: "auto" }}
                  >
                    <div className='d-flex'>
                      <div className='flex-grow-1 cursor-pointer' onClick={() => goToConditionsScreen(process)}>
                        {!!(process.id_prog) && <>
                          <span className=' fw-bold text-info'>{process.programa}</span>
                          <span className='ps-1 text-info fw-semibold d-inline-block'> - {process.cod_snies}</span>
                        </>
                        }
                      </div>
                      {/* {is_admin && <div className='position-absolute end-0 pe-2 pe-sm-3 pe-lg-4'> */}
                      {is_admin && <div className='ms-3'>
                        <CustomDropdown options={[
                          { text: "Modificar proceso", icon: <BsPencilSquare size={16} />, click: () => modalToEditProcess(process) },
                          { text: "Eliminar proceso", icon: <BsXCircle size={16} />, click: () => confirmDeleteProcess(process) },
                        ]}>
                          <DropdownToggle size="sm" color='light' className='rounded-3'>
                            <BsThreeDotsVertical size={18} />
                          </DropdownToggle>
                        </CustomDropdown>
                      </div>}
                    </div>
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
                      {/* <div className='mb-2'>
                            <span className="d-block small">{process.est_conv === 1 ? "ABIERTO" : "CERRADO"}</span>
                          </div> */}
                      <div className=''>
                        <div className='d-flex justify-content-between flex-bottom'>
                          <table className='d-inline-block'>
                            <tbody className='align-top'>
                              <tr>
                                <td className='fw-bold small pe-2 pb-2'>Proceso:</td>
                                <td className='small pb-2'>{process.nomb_conv}
                                  <span className='d-none d-md-inline-block opacity-50 text-secondary ps-2'> (Creado el {getNormalDate(process.marc_temp)})</span>
                                </td>
                              </tr>
                              <tr>
                                <td className='fw-bold small pe-2 pb-2'>Sede:</td>
                                <td className='small pb-2'>{process.sede}</td>
                              </tr>
                              <tr>
                                <td className='fw-bold small pe-2'>Fase actual:</td>
                                <td className='small'>{process.fase_actual}</td>
                              </tr>
                            </tbody>
                          </table>
                          <div className='text-md-center d-inline-flex flex-column justify-content-end'>
                            <b className="small d-none d-sm-block fw-semibold mt-1 mb-2">Progreso</b>
                            <div>
                              <CircleProgress
                                progress={process.porcentaje || 0}
                                stroke={8}
                                radius={32}
                                color={process.porcentaje >= 100 ? "#0d6efd" : undefined}
                              >
                                {`${process.porcentaje || 0}%`}
                              </CircleProgress>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
            }</>
        }
      </div>
    </>
  );
};

export default Process;
