import { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader, ButtonProps } from 'reactstrap';
import { I_ModalActionButtons, ModalFooter } from './../Modal';

interface I_Props extends I_ModalActionButtons {
  isOpen: boolean;
  title?: string | JSX.Element | JSX.Element[];
  subtitle?: string | JSX.Element | JSX.Element[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClosed?: () => void;
};

const Alert = ({
  title,
  isOpen = false,
  subtitle,
  onClosed,
  submitButton,
  closeButton,
  size = 'md'
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
          <div className='justify-content-center p-3 text-success'>
            <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" fill="currentColor" className="bi bi-check-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
          </div>
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
