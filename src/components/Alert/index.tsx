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

export interface I_AlertObject {
  isOpen: boolean;
  fullscreen?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  onClosed?: () => void;
  showCloseX?: boolean;
  closeButton?: T_Btn;
  submitButton?: T_Btn;
  title?: string | JSX.Element | JSX.Element[];
  subtitle?: string | JSX.Element | JSX.Element[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: keyof typeof alertType;
  needFillConfirmation?: boolean;
}

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
  submitButton,
  fullscreen, 
  needFillConfirmation
}: I_AlertObject) => {
  const [showAlert, setShowAlert] = useState(isOpen);

  const toggle = () => setShowAlert(!showAlert);

  useEffect(() => setShowAlert(isOpen), [isOpen])

  const buttons = [];

  if (closeButton) {
    buttons.push(<Button
      key="closeButton"
      color="primary2"
      {...closeButton}
      onClick={() => {
        toggle();
        closeButton.onClick?.();
      }}>{closeButton.value || "Cerrar"}</Button>
    )
  }

  if (submitButton) {
    buttons.push(<Button
      key="submitButton"
      color="primary"
      {...submitButton}
      onClick={() => {
        !needFillConfirmation && toggle();
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
      fullscreen={fullscreen || false}
    >
      <ModalHeader className='border-0 pb-0 flex-column-reverse'
        toggle={showCloseX ? toggle : undefined}
      >
        <div className='justify-content-center p-3'>{alertType[type!]}</div>
      </ModalHeader>
      <ModalBody className="text-center">
        {title && <h3 className='mb-4'>{title}</h3>}
        {subtitle && <div className='mb-0 text-muted'>{subtitle}</div>}
      </ModalBody>
      <ModalFooter>{buttons}</ModalFooter>
    </Modal>
  )
}

export default Alert;
