import { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { CheckCircleFill, ExclamationCircleFill, InfoCircleFill, QuestionCircleFill, XCircleFill } from '../Icons';
import { I_ModalActionButtons, ModalFooter } from './../Modal';

interface I_Props extends I_ModalActionButtons {
  isOpen: boolean;
  title?: string | JSX.Element | JSX.Element[];
  subtitle?: string | JSX.Element | JSX.Element[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClosed?: () => void;
  type?: keyof typeof alertType;
};

const alertType = {
  info: <i className='text-info'><InfoCircleFill size={55} /></i>,
  success: <i className='text-success'><CheckCircleFill size={55} /></i>,
  error: <i className='text-danger'><XCircleFill size={55} /></i>,
  warning: <i className='text-warning'><ExclamationCircleFill size={55} /></i>,
  question: <i className='text-primary'><QuestionCircleFill size={55} /></i>,
}

const Alert = ({
  title,
  isOpen = false,
  subtitle,
  onClosed,
  submitButton,
  closeButton,
  size = 'md',
  type,
}: I_Props) => {
  const [showAlert, setShowAlert] = useState(isOpen);

  useEffect(() => {
    setShowAlert(isOpen);
  }, [isOpen])

  const toggle = (action?: boolean) => {
    action !== undefined ? setShowAlert(action) : setShowAlert(!showAlert);
  };

  return (
    <Modal
      centered
      contentClassName='border-0 pb-2'
      isOpen={showAlert}
      onClosed={onClosed}
      backdrop="static"
      size={size}
    >
      {
        <ModalHeader className='border-0 pb-0 flex-column-reverse' toggle={!(!!(closeButton) || !!(submitButton)) ? (() => toggle()) : undefined}>
          <div className='justify-content-center p-3'>{alertType[type!]}</div>
        </ModalHeader>
      }
      <ModalBody className="text-center">
        {title && <h3 className='mb-4'>{title}</h3>}
        {subtitle && <p>{subtitle}</p>}
      </ModalBody>
      <ModalFooter action={toggle} closeButton={closeButton} submitButton={submitButton} />
    </Modal>
  )
}

export default Alert;
