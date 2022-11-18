import { useState, useEffect, useRef } from 'react';
import { Button, Modal as ModalB, ModalHeader, ModalBody, ModalFooter as ModalFooterB, ModalProps, ButtonProps } from 'reactstrap';
import classnames from 'classnames';
import Form from 'react-ngm-form';

type T_ModalToggleAction = (toggle?: boolean) => void;
type T_Btn = Omit<ButtonProps, 'onClick'> & {
    /**
     * Custom onClick function.
     * The parameter is the modal toggle function
     */
    onClick?: (modalToggleFunction: T_ModalToggleAction) => void;
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
    form?: { fields: Array<any>, defaultValues: { [x: string]: any }, onSubmit: (data: any, toggle: T_ModalToggleAction) => void };
}

const Modal = ({
    title,
    children,
    submitButton,
    closeButton,
    onClosed,
    isOpen,
    form,
    className
}: ModalProps & I_ModalContentProps) => {
    const [showModal, setShowModal] = useState(isOpen);
    const btnSubmitInForm = useRef<any>(null);

    useEffect(() => {
        setShowModal(isOpen);
    }, [isOpen])

    const toggle: T_ModalToggleAction = (action?: boolean) => {
        action !== undefined ? setShowModal(action) : setShowModal(!showModal);
    };

    return (
        <ModalB
            modalTranssition
            contentClassName={classnames('p-md-2 p-xl-3 border-0', className)}
            style={{ border: 0 }}
            isOpen={showModal}
            toggle={() => toggle()}
            centered
            fullscreen="sm"
            onClosed={onClosed}
        >
            {title && <ModalHeader toggle={() => toggle()} style={{ border: 0 }}>{title}</ModalHeader>}

            {form ? <>
                <ModalBody>
                    {children}
                    <Form {...form} onSubmit={data => form.onSubmit(data, toggle)} >
                        <button type='submit'  ref={btnSubmitInForm} className="d-none"></button>
                    </Form>
                </ModalBody>
                <ModalFooter closeButton={closeButton} submitButton={{ ...submitButton, onClick:()=> btnSubmitInForm.current.click() }} action={() => { }} />
            </>
                :
                <>
                    <ModalBody>
                        {children}
                    </ModalBody>
                    <ModalFooter closeButton={closeButton} submitButton={submitButton} action={toggle} />
                </>
            }
        </ModalB >
    );
}

export default Modal;

export const ModalFooter = ({
    closeButton,
    submitButton,
    action
}: { action: (t?: boolean) => void } & I_ModalActionButtons) => (closeButton || submitButton) ?
        <ModalFooterB style={{ border: 0, justifyContent: closeButton && submitButton ? "space-between" : "center" }}>
            {closeButton &&
                <Button color='primary' {...closeButton}
                    type="button"
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