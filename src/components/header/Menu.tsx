import { useState } from 'react'
import { Button, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector'
import { logout } from '../../store/actions/userActions';
import Alert, { I_AlertObject } from '../Alert';

interface I_MenuProps {
    children: JSX.Element | JSX.Element[]
}

const Menu = ({ children }: I_MenuProps) => {

    const userInfo = useAppSelector(state => state.user.userInfo);
    const dispatch = useAppDispatch();

    const [_alert, setAlert] = useState<null | I_AlertObject>(null);

    const confirmLogout = () => {
        setAlert({
            isOpen: true,
            title: "¿Desea cerrar la sesión?",
            type: "question",
            submitButton: {
                value: "Sí, cerrar",
                onClick: () => {
                    dispatch(logout())
                }
            },
            closeButton: { value: "No, cancelar" }
        })
    }

    return (
        <div>
            <Alert isOpen={!!(_alert?.isOpen)}{..._alert} onClosed={() => { setAlert(null) }} />

            <UncontrolledDropdown>
                <DropdownToggle caret tag="div" className='d-flex align-items-center'>
                    {children}
                </DropdownToggle>
                <DropdownMenu className='border-0 shadow-sm mt-1 py-3'>
                    <DropdownItem header >
                        {userInfo?.mail}
                    </DropdownItem>
                    <DropdownItem header >
                        DNI: {userInfo?.dni}
                    </DropdownItem>
                    <DropdownItem disabled tag="div" style={{"pointerEvents": "initial"}} className="mt-4 text-center">
                        <Button color='primary' onClick={confirmLogout}>Cerrar sesión</Button>
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        </div>
    )
}

export default Menu;