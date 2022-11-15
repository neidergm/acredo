import { useState, useEffect } from 'react';
import { Button, Modal as ModalB, ModalHeader, ModalBody, ModalFooter, ModalProps, ButtonProps } from 'reactstrap';

export interface I_ModalContentProps {
    title?: JSX.Element | JSX.Element[] | any;
    buttons: ButtonProps[];
    children: JSX.Element | JSX.Element[] | string;
}

interface I_ModalProps {
    toggleCallback: () => void;
}

const Modal = ({
    toggleCallback,
    title,
    children,
    buttons,
    isOpen
}: I_ModalProps & ModalProps & I_ModalContentProps) => {
    const [showModal, setShowModal] = useState(isOpen);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen])

    const toggle = () => setShowModal(!showModal);

    return (
        <ModalB
            style={{ border: 0 }}
            isOpen={showModal}
            toggle={toggle}
            centered
            fullscreen="sm"
            onClosed={toggleCallback}
        >
            <ModalHeader toggle={toggle} style={{ border: 0 }}>{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter style={{ border: 0, justifyContent: "space-between" }}>
                {buttons?.map(({ value, ...button }, i) => <Button {...button} key={i}>{value}</Button>)}
            </ModalFooter>
        </ModalB>
    );
}

export default Modal;
