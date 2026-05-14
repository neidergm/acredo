import { useEffect, useState } from 'react'
import { SubHeader } from '../../components/SubHeader'
import { AXIOS_REQUEST } from '../../services/axiosService';
import { CHARGE, RESPONSIBLES_BY_CHARGE } from '../../services/endPointsService';
import Loader from '../../components/Loader';
import { BsPencilSquare, BsExclamationCircleFill, BsPlus, BsThreeDotsVertical, BsXCircle } from 'react-icons/bs';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Button, DropdownToggle, FormGroup, Input, ListGroup, ListGroupItem } from 'reactstrap';
import style from './styles.module.css';
import classnames from 'classnames';
import useAlert from '../../hooks/useAlert';
import Alert from '../../components/Alert';
import CustomDropdown from '../../components/CustomDropdown';
import { Modal, ModalBody, ModalFooter, ModalHeader, type T_ModalJSON, closeModal } from '../../components/Modal';
import useLoader from '../../hooks/useLoader';

type T_Charge = {
  id_cargo: number;
  marc_temp: string;
  marc_update: string;
  nivel_cargo: number;
  nomb_cargo: string;
  opera_cargo: number;
  padre_cargo: number;
}

type T_UserInCharge = {
  disponible: null | 0 | 1;
  id_cargo: number;
  id_rc: number;
  iden_resp: string;
  nomb_cargo: string;
  nomb_resp: string;
}

const UsersManagement = () => {

  const { alertData, openAlert } = useAlert();
  const [modal, setModal] = useState<T_ModalJSON | null>(null);

  const [groups, setGroups] = useState<T_Charge[] | null | false>(null);
  const [usersByGroup, setUsersByGroups] = useState<Array<T_UserInCharge[]>>([]);
  const [opened, setOpened] = useState<string[]>([]);

  const { openLoader, closeLoader } = useLoader()

  // const user = useAppSelector(s => s.user.userInfo)
  // const is_admin = isAdmin(user?.rol)
  const is_admin = false

  const pickGroup = (idx: number) => {
    const group = (groups as T_Charge[])[idx]

    setOpened(i => {
      const f = i.findIndex(id => id === `${idx}`)
      if (f !== -1) {
        i.splice(f, 1)
      } else {
        i.push(`${idx}`)
      }
      return [...i]
    })

    if (!usersByGroup[idx]) getUsersByGroup(group.id_cargo, idx)
  }

  const createCharge = () => {
    const formID = "CREATE_CHARGE_FORM";

    setModal({
      isOpen: true,
      title: 'Crear cargo',
      children: <>
        Create charge user form
      </>,
      size: "lg",
      footer: <ModalFooter>
        <Button color='primary-surface' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button form={formID} color='primary'>Guardar</Button>
      </ModalFooter>
    })
  }

  const addUser = (groupIdx: number) => {
    const formID = "ADD_USER_FORM";
    const group = (groups as T_Charge[])[groupIdx];

    setModal({
      isOpen: true,
      title: 'Agregar usuario',
      children: <>
        <p>Cargo: {group.nomb_cargo}</p>
        <p>Nivel del cargo: {group.nivel_cargo}</p>
        Add user form
      </>,
      size: "lg",
      footer: <ModalFooter>
        <Button color='primary-surface' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button form={formID} color='primary'>Guardar</Button>
      </ModalFooter>
    })
  }

  const editUser = () => {
    const formID = "EDIT_USER_FORM";

    setModal({
      isOpen: true,
      title: 'Modificar usuario',
      children: <>
        BsPencilSquare user form
      </>,
      size: "lg",
      footer: <ModalFooter>
        <Button color='primary-surface' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button form={formID} color='primary'>Guardar</Button>
      </ModalFooter>
    })
  }

  const deleteCharge = async (chargeIdx: number) => {

    const hasUsers = usersByGroup[chargeIdx];

    if (!hasUsers) openLoader("Verificando")

    let openAl = (q?: number) => openAlert({
      title: "Espera",
      type: "error",
      children: `No se puede eliminar el cargo debido a que cuenta con ${q} usuarios asociados`,
      closeButton: { value: "Ok" }
    })

    const users = usersByGroup[chargeIdx] || await getUsersByGroup((groups as T_Charge[])[chargeIdx].id_cargo, chargeIdx).then(r => r)

    const q = users.length;

    if (q) {
      return !hasUsers ? closeLoader(() => openAl(q)) : openAl(q)
    }

    openAl = () => openAlert({
      title: "Â¿EstÃ¡s seguro?",
      type: "question",
      children: "Se eliminarÃ¡ este cargo de forma permanente",
      closeButton: { value: "No, cancelar" },
      submitButton: {
        value: "Si, eliminar", onClick: () => {
          openLoader("Eliminando cargo", () => {
            setUsersByGroups([])
            getUsersByGroup((groups as T_Charge[])[chargeIdx].id_cargo, chargeIdx).then(() => {
              closeLoader()
            })
          })
        }
      }
    })

    if (!hasUsers) { closeLoader(() => openAl()) } else { openAl() }


  }

  const editCharge = (chargeIdx: number) => {
    const formID = "EDIT_USER_FORM";
    const group = (groups as T_Charge[])[chargeIdx];
    setModal({
      isOpen: true,
      title: 'Modificar cargo',
      children: <>
        <p>Cargo: {group.nomb_cargo}</p>
        <p>Nivel del cargo: {group.nivel_cargo}</p>
        BsPencilSquare charge form
      </>,
      size: "lg",
      footer: <ModalFooter>
        <Button color='primary-surface' onClick={() => closeModal(setModal)}>Cancelar</Button>
        <Button form={formID} color='primary'>Guardar</Button>
      </ModalFooter>
    })
  }

  const toggleUser = (user: T_UserInCharge, groupIdx: number) => {
    if (!is_admin) return false;

    const isEnabled = user.disponible === 0;

    openAlert({
      title: "Â¿EstÃ¡ seguro?",
      type: "question",
      children: isEnabled ? 'Se realizarÃ¡ la desactivaciÃ³n de este usuario' : 'Se realizarÃ¡ la activaciÃ³n de este usuario',
      closeButton: { value: "No, cancelar" },
      submitButton: {
        value: `Si, realizar`, onClick: () => {
          setUsersByGroups((g) => {
            g[groupIdx] = [{ ...user, disponible: isEnabled ? 0 : 1 }];
            return [...g]
          })
          // getUsersByGroup(groupIdx);
        }
      }
    })
  }

  const getUsersByGroup = (group: number, chargeIdx: number) => {
    return AXIOS_REQUEST(`${RESPONSIBLES_BY_CHARGE}${group}`).then(r => r.data || []).then(r => {
      setUsersByGroups(i => {
        if (!i) i = [];
        i[chargeIdx] = r
        return [...i]
      })
      return usersByGroup[chargeIdx]
    })
  }

  useEffect(() => {
    AXIOS_REQUEST(CHARGE).then(r => {
      setGroups(r.data)
    }).catch(() => {
      setGroups(false)
    })
  }, [])


  return (
    <>
      <SubHeader
        showBackButton
        text="GestiÃ³n de usuarios"
        className="container-xxl"
      />

      <Modal size={modal?.size}
        isOpen={!!(modal?.isOpen)}
        onClosed={() => { setModal(null) }}
        toggle={() => closeModal(setModal)}
      >
        <ModalHeader textCenter toggle={() => closeModal(setModal)}>{modal?.title}</ModalHeader>
        <ModalBody>{modal?.children}</ModalBody>
        {modal?.footer}
      </Modal>

      <Alert {...alertData} />

      <div className="container-xxl">
        <div className="mb-5">
          {groups === null ? < Loader loaderAsModal={false} isOpen>
            <p className='small'>Consultando cargos</p>
          </Loader>
            :
            groups === false ?
              <div className='p-5 text-center text-secondary opacity-50'>
                <p className='text-secondary'><BsExclamationCircleFill size={30} /></p>
                <span>No se pudo obtener el listado de cargos</span>
              </div>
              :
              <div>
                <div className='d-flex justify-content-between mb-4'>
                  <div className='small text-secondary'>
                    <Button disabled size='sm'>
                      {groups.length} cargos
                    </Button>
                  </div>
                  <div>
                    {is_admin && <Button size="sm" color='primary' onClick={createCharge}><BsPlus size={17} /> Crear nuevo cargo</Button>}
                  </div>
                </div>
                <Accordion className={style["container-list"]} open={opened} toggle={(targetId: string) => pickGroup(Number(targetId))}>
                  {groups.map((g, idx) => <AccordionItem key={`${idx}`}
                    className={classnames({ [style["active"]]: opened.includes(`${idx}`) })}
                  >
                    {is_admin && <div className='position-relative'>
                      <CustomDropdown
                        options={[
                          {
                            text: "Modificar cargo",
                            icon: <BsPencilSquare size={17} />,
                            click: () => { editCharge(idx) }
                          },
                          {
                            text: "Eliminar cargo",
                            icon: <BsXCircle size={17} />,
                            click: () => { deleteCharge(idx) }
                          }
                        ]}
                      >
                        <DropdownToggle tag={'div'} className='position-absolute mt-2 ms-2' style={{ zIndex: 10 }}>
                          <Button size='sm' outline color='light' className='text-dark border-0'>
                            <BsThreeDotsVertical size={16} />
                          </Button>
                        </DropdownToggle>
                      </CustomDropdown>
                    </div>}
                    <AccordionHeader targetId={`${idx}`} >
                      <span className={classnames({ 'ps-4 ms-1': is_admin })}>
                        {g.nomb_cargo}
                      </span>
                      <small className='opacity-50 text-end flex-grow-1 px-2 text-nowrap'>Nivel {g.nivel_cargo}</small>
                    </AccordionHeader>
                    <AccordionBody accordionId={`${idx}`}>
                      {usersByGroup[idx] ? <ListGroup flush>
                        {!!usersByGroup[idx].length && <div className='d-flex justify-content-between mb-3 align-items-center'>
                          <div className='small text-muted'>Activo</div>
                          <div>
                            {is_admin && <Button size="sm" color='primary-surface' onClick={() => addUser(idx)} ><BsPlus size={17} /> Agregar usuario</Button>}
                          </div>
                        </div>}
                        {usersByGroup[idx].length ?
                          usersByGroup[idx].map(u => <ListGroupItem key={`u-${u.id_rc}`} className='px-0 px-md-2'>
                            <div className='d-flex gap-3 text-secondary align-items-center'>
                              <div>
                                <FormGroup switch disabled>
                                  <Input type="switch" className='cursor-pointer' role="switch"
                                    disabled={!is_admin}
                                    checked={u.disponible === 0}
                                    onChange={() => {
                                      toggleUser(u, idx)
                                    }} />
                                </FormGroup>
                              </div>
                              <div>
                                {u.nomb_resp} <small className='d-none d-md-inline'>({u.iden_resp})</small>
                                <Button color='link' className='py-0 mb-1' onClick={() => editUser()}> <BsPencilSquare size={16} /></Button>
                              </div>
                              <div className='ms-auto d-none d-md-block'>
                                ROL DE USUARIO
                              </div>
                            </div>
                          </ListGroupItem>)
                          :
                          <ListGroupItem key={`u-add`} className='px-0 px-md-2'>
                            <div className='text-warning'>
                              <BsExclamationCircleFill />
                              <span className='ps-2'>
                                No tiene usuarios asociados
                              </span>

                              <div className='float-end'>
                                <Button size="sm" color='primary-surface'><BsPlus /> Agregar usuario</Button>
                              </div>
                            </div>
                          </ListGroupItem>
                        }
                      </ListGroup>
                        :
                        <Loader loaderAsModal={false} >
                          <small className='d-block'>Consultando usuarios</small>
                        </Loader>
                      }

                    </AccordionBody>
                  </AccordionItem>)}
                </Accordion>
              </div>
          }
        </div>
      </div >
    </>
  )
}

export default UsersManagement