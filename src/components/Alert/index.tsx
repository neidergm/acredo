import { useState, useEffect } from 'react';
import { CheckCircleFill, ExclamationCircleFill, InfoCircleFill, QuestionCircleFill, XCircleFill } from '../Icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../Modal';
import { ButtonProps, Button } from 'reactstrap';

type T_Btn = Omit<ButtonProps, 'onClick'> & {
  /**
   * Custom onClick function.
   * The parameter is the modal toggle function
   */
  onClick?: () => void;
};

// interface I_Props extends I_ModalActionButtons {
interface I_Props {
  isOpen: boolean;
  onClosed: () => void;
  showCloseX?: boolean;
  closeButton?: T_Btn;
  submitButton?: T_Btn;
  title?: string | JSX.Element | JSX.Element[];
  subtitle?: string | JSX.Element | JSX.Element[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: keyof typeof alertType;
};

const alertType = {
  info: <i className='text-primary'><InfoCircleFill size={55} /></i>,
  success: <i className='text-success'><CheckCircleFill size={55} /></i>,
  error: <i className='text-danger'><XCircleFill size={55} /></i>,
  warning: <i className='text-warning'><ExclamationCircleFill size={55} /></i>,
  question: <i className='text-info'><QuestionCircleFill size={55} /></i>,
}

const Alert = ({
  title,
  showCloseX,
  isOpen = false,
  subtitle,
  onClosed,
  size = 'md',
  type,
  closeButton,
  submitButton
}: I_Props) => {
  const [showAlert, setShowAlert] = useState(isOpen);

  const toggle = () => setShowAlert(!showAlert);

  useEffect(() => setShowAlert(isOpen), [isOpen])

  const buttons = [];

  if (closeButton) {
    buttons.push(<Button
      color="primary"
      {...closeButton}
      onClick={() => {
        toggle();
        closeButton.onClick?.();
      }}>{closeButton.value || "Cerrar"}</Button>
    )
  }

  if (submitButton) {
    buttons.push(<Button
      color="primary"
      {...submitButton}
      onClick={() => {
        toggle();
        submitButton.onClick?.();
      }}>{submitButton.value}</Button>
    )
  }

  return (
    <Modal
      size={size}
      isOpen={showAlert}
      onClosed={onClosed}
      backdrop="static"
    >
      <ModalHeader className='border-0 pb-0 flex-column-reverse'
        toggle={showCloseX ? toggle : undefined}
      >
        <div className='justify-content-center p-3'>{alertType[type!]}</div>
      </ModalHeader>
      <ModalBody className="text-center">
        {title && <h3 className='mb-4'>{title}</h3>}
        {subtitle && <p className='mb-0 text-secondary'>{subtitle}</p>}
      </ModalBody>
      <ModalFooter>{buttons}</ModalFooter>
      {/*  <ModalFooter action={toggle} closeButton={closeButton} submitButton={submitButton} /> */}
    </Modal>
    // <Modal
    //   centered
    //   contentClassName='border-0 pb-2'
    //   isOpen={showAlert}
    //   onClosed={onClosed}
    //   backdrop="static"
    //   size={size}
    // >
    //   {
    //     <ModalHeader className='border-0 pb-0 flex-column-reverse' toggle={!(!!(closeButton) || !!(submitButton)) ? (() => toggle()) : undefined}>
    //       <div className='justify-content-center p-3'>{alertType[type!]}</div>
    //     </ModalHeader>
    //   }
    //   <ModalBody className="text-center">
    //     {title && <h3 className='mb-4'>{title}</h3>}
    //     {subtitle && <p>{subtitle}</p>}
    //   </ModalBody>
    //   <ModalFooter action={toggle} closeButton={closeButton} submitButton={submitButton} />
    // </Modal>
  )
}

export default Alert;
