import { Badge, Button, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector'
import { logout } from '../../store/slices/userSlice';
import Alert from '../Alert';
import useAlert from '../../hooks/useAlert';
import { Stack } from 'react-bootstrap';
import { LuCircleHelp, LuPower } from 'react-icons/lu';
import { APP_HELP_LINK } from '../../services/constantsService';

interface I_MenuProps {
    children: JSX.Element | JSX.Element[]
}

const Menu = ({ children }: I_MenuProps) => {

    const userInfo = useAppSelector(state => state.user.userInfo);
    const dispatch = useAppDispatch();

    const { alertData, openAlert } = useAlert();

    const confirmLogout = () => {
        openAlert({
            title: "¿Desea cerrar la sesión?",
            type: "question",
            submitButton: {
                value: "Sí, cerrar",
                onClick: () => dispatch(logout())
            },
            closeButton: { value: "No, cancelar" }
        })
    }

    return (
        <div>
            <Alert {...alertData} />

            <Dropdown>
                <Dropdown.Toggle as="div" className='d-flex align-items-center'>
                    {children}
                </Dropdown.Toggle>
                <Dropdown.Menu className='shadow mt-1 py-5 px-sm-3 px-2 '>
                    <Dropdown.Header >
                        <Stack direction='horizontal' gap={4} className=' border-bottom pb-6 mb-4'>
                            <img
                                src={userInfo?.picture || "/images/default-profile.png"}
                                alt="Foto de perfil"
                                className="rounded-circle"
                                width={75}
                                height={75}
                            />
                            <div className='small fw-semibold text-wrap'>
                                {userInfo?.displayName}
                            </div>
                        </Stack>
                    </Dropdown.Header>

                    <Dropdown.Item disabled className='text-body text-wrap' as={"div"}>
                        <Stack direction='horizontal' gap={2} className='mb-7 justify-content-between align-items-center lh-1'>
                            <Badge bg="primary-subtle" text="primary text-uppercase">
                                {userInfo?.rol_nomb || "Usuario"}
                            </Badge>
                            <small>DNI: {userInfo?.dni}</small>
                        </Stack>
                        <p className='lh-sm'>
                            <small className='d-block fw-semibold'>Cargo:</small>
                            <span>{userInfo?.cargo}</span>
                        </p>
                        <p className='lh-sm'>
                            <small className='d-block fw-semibold'>Correo:</small>
                            <span>{userInfo?.mail}</span>
                        </p>
                    </Dropdown.Item>

                    <Dropdown.ItemText as={"div"} className='d-flex justify-content-between align-items-end'>
                        <Button variant='light' className="mt-4" onClick={confirmLogout}>
                            <LuPower /> Cerrar sesión
                        </Button>

                        {APP_HELP_LINK &&
                            <OverlayTrigger
                                overlay={<Tooltip id="btt-2">Ir al centro de ayuda</Tooltip>}
                            >
                                {(p) => (
                                    <Button
                                        {...p}
                                        variant='link'
                                        className="px-0"
                                        onClick={() => window.open(APP_HELP_LINK, "_blank")}
                                    >
                                        <LuCircleHelp size={20} />
                                    </Button>
                                )}
                            </OverlayTrigger>
                        }
                    </Dropdown.ItemText>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default Menu;