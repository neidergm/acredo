import { useState, useEffect } from 'react';
import { Button, Modal as ModalB, ModalHeader, ModalBody, ModalFooter as ModalFooterB, ModalProps, ButtonProps } from 'reactstrap';

export interface I_ModalContentProps {
    children: JSX.Element | JSX.Element[] | string;
    closeButton?: ButtonProps;
    submitButton?: ButtonProps;
    title?: JSX.Element | JSX.Element[] | any;
    onClosed?: () => void;
    isOpen?: boolean;
}

export const ModalFooter = ({
    btn1,
    btn2,
    action
}: {
    btn1?: ButtonProps,
    btn2?: ButtonProps,
    action: Function
}) => (btn1 || btn2) ?
    <ModalFooterB style={{ border: 0, justifyContent: btn1 && btn2 ? "space-between" : "center" }}>
        {btn1 &&
            <Button color='primary' {...btn1}
                onClick={() => { btn1.onClick?.(action as any) || action() }}
            >
                {btn1.value || "Cancelar"}
            </Button>
        }
        {btn2 &&
            <Button color='primary' {...btn2}
                onClick={() => {
                    if (!!(btn2.onClick)) return btn2.onClick(action as any);
                    action()
                }}
            >
                {btn2.value || "Ok"}
            </Button>
        }
    </ModalFooterB> : null

const Modal = ({
    title,
    children,
    submitButton,
    closeButton,
    onClosed,
    isOpen
}: ModalProps & I_ModalContentProps) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen])

    const toggle = (action?: boolean) => {
        action !== undefined ? setShowModal(action) : setShowModal(!showModal);
    };

    return (
        <ModalB
            modalTranssition
            contentClassName='p-md-2 p-xl-3 border-0'
            style={{ border: 0 }}
            isOpen={showModal}
            toggle={() => toggle()}
            centered
            fullscreen="sm"
            onClosed={onClosed}
        >
            {title && <ModalHeader toggle={() => toggle()} style={{ border: 0 }}>{title}</ModalHeader>}
            <ModalBody>{children}</ModalBody>
            <ModalFooter btn1={closeButton} btn2={submitButton} action={toggle} />
        </ModalB>
    );
}

export default Modal;


/**
 * Usage example
 * 
 * setModalData({
 *   title: "hola",
 *   closeButton: { color: "danger" },
 *   submitButton: { color: "success", onClick: successAction as any },
 *   children: "lorem",
 * })
 * 
 * const successAction = (toggle: Function) => {
 *      console.log("ok")
 *      setModalData({ children: "Cargando" })
 *      toggle(true)
 *  }
 */