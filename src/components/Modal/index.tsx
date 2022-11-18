import { useState, useEffect } from 'react';
import { Button, Modal as ModalB, ModalHeader, ModalBody, ModalFooter as ModalFooterB, ModalProps, ButtonProps } from 'reactstrap';

type T_Btn = Omit<ButtonProps, 'onClick'> & {
    /**
     * Custom onClick function.
     * The parameter is the modal toggle function
     */
    onClick?: (modalToggleFunction: (toggle?: boolean) => void) => void
};

export interface I_ModalActionButtons {
    closeButton?: T_Btn;
    submitButton?: T_Btn;
}

export interface I_ModalContentProps extends I_ModalActionButtons {
    children: JSX.Element | JSX.Element[] | string;
    title?: JSX.Element | JSX.Element[] | any;
    onClosed?: () => void;
    isOpen?: boolean;
}

export const ModalFooter = ({
    closeButton,
    submitButton,
    action
}: { action: (t?: boolean) => void } & I_ModalActionButtons) => (closeButton || submitButton) ?
        <ModalFooterB style={{ border: 0, justifyContent: closeButton && submitButton ? "space-between" : "center" }}>
            {closeButton &&
                <Button color='primary' {...closeButton}
                    onClick={() => {
                        if (!!(closeButton.onClick)) return closeButton.onClick(action);
                        action();
                    }}
                >{closeButton.value || "Cancelar"}</Button>
            }
            {submitButton &&
                <Button color='primary' {...submitButton}
                    onClick={() => {
                        if (!!(submitButton.onClick)) return submitButton.onClick(action);
                        action()
                    }}
                >{submitButton.value || "Ok"}</Button>
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
            <ModalFooter closeButton={closeButton} submitButton={submitButton} action={toggle} />
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
 *   submitButton: { color: "success", onClick: successAction },
 *   children: "lorem",
 * })
 * 
 * const successAction = (toggle) => {
 *      console.log("ok")
 *      setModalData({ children: "Cargando" })
 *      toggle(true)
 *  }
 * 
 *  <Modal
 *    onClosed={() => setModalData(null)}
 *    isOpen={!!(modalData)}
 *    {...modalData as I_ModalContentProps}
 * />
 * 
 */