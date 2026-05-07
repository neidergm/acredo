import { BsCheckCircleFill, BsExclamationCircleFill, BsInfoCircleFill, BsQuestionCircleFill, BsXCircleFill } from 'react-icons/bs';
import { Modal, ModalBody, ModalFooter, ModalHeader } from '../Modal';
import { type ButtonProps, Button } from 'reactstrap';
import type { ReactNode } from 'react';

type T_Btn = Omit<ButtonProps, 'onClick'> & {
  /**
   * Custom onClick function.
   * The parameter is the modal toggle function
   */
  onClick?: (data?: never) => void;
};

export interface I_AlertObject {
  isOpen: boolean,
  onClosed?: () => void,
  onOpened?: () => void,
  children?: ReactNode;
  fullscreen?: boolean | 'sm' | 'md' | 'lg' | 'xl';
  showCloseX?: boolean;
  closeButton?: T_Btn;
  submitButton?: T_Btn;
  title?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  type?: keyof typeof alertType;
}

const alertType = {
  info: <i className='text-primary'><BsInfoCircleFill size={55} /></i>,
  success: <i className='text-success'><BsCheckCircleFill size={55} /></i>,
  error: <i className='text-danger'><BsXCircleFill size={55} /></i>,
  warning: <i className='text-warning'><BsExclamationCircleFill size={55} /></i>,
  question: <i className='text-info'><BsQuestionCircleFill size={55} /></i>,
}

const Alert = ({
  title,
  showCloseX,
  type,
  children,
  closeButton,
  submitButton,
  fullscreen,
  closeAlert,
  ...props
}: I_AlertObject & { closeAlert?: (closeCallback?: () => void) => void }) => {

  const buttons = [];

  if (closeButton) {
    buttons.push(
      <Button
        key="closeButton"
        color="primary2"
        {...closeButton}
        onClick={() => {
          closeAlert?.(closeButton.onClick);
        }}>{closeButton.value || "Cerrar"}</Button>
    )
  }

  if (submitButton) {
    buttons.push(
      <Button
        key="submitButton"
        color="primary"
        {...submitButton}
        onClick={() => {
          // !needFillConfirmation && closeAlert?.(submitButton.onClick);
          if (submitButton.onClick) closeAlert?.(submitButton.onClick);
        }}>{submitButton.value}</Button>
    )
  }

  return (
    <Modal
      backdrop="static"
      fullscreen={fullscreen || false}
      modalTransition={{ timeout: 100 }}
      backdropTransition={{ timeout: 100 }}
      {...props}
    >
      <ModalHeader className='border-0 pb-0 flex-column-reverse'
        toggle={showCloseX ? () => closeAlert?.() : undefined}
      >
        <div className='justify-content-center p-3'>{type && alertType[type]}</div>
      </ModalHeader>
      <ModalBody className="text-center">
        {title && <h3 className='mb-4'>{title}</h3>}
        {children && <div className='mb-0 text-muted'>{children}</div>}
      </ModalBody>
      <ModalFooter>{buttons}</ModalFooter>
    </Modal>
  )
}

export default Alert;


// import { useState, useEffect } from 'react';
// import { BsCheckCircleFill, BsExclamationCircleFill, BsInfoCircleFill, BsQuestionCircleFill, BsXCircleFill } from '../Icons';
// import { Modal, ModalBody, ModalFooter, ModalHeader } from '../Modal';
// import { ButtonProps, Button } from 'reactstrap';

// type T_Btn = Omit<ButtonProps, 'onClick'> & {
//   /**
//    * Custom onClick function.
//    * The parameter is the modal toggle function
//    */
//   onClick?: () => void;
// };

// export interface I_AlertObject {
//   isOpen: boolean;
//   fullscreen?: boolean | 'sm' | 'md' | 'lg' | 'xl';
//   onClosed?: () => void;
//   showCloseX?: boolean;
//   closeButton?: T_Btn;
//   submitButton?: T_Btn;
//   title?: string | JSX.Element | JSX.Element[];
//   subtitle?: string | JSX.Element | JSX.Element[];
//   size?: 'sm' | 'md' | 'lg' | 'xl';
//   type?: keyof typeof alertType;
//   needFillConfirmation?: boolean;
// }

// const alertType = {
//   info: <i className='text-primary'><BsInfoCircleFill size={55} /></i>,
//   success: <i className='text-success'><BsCheckCircleFill size={55} /></i>,
//   error: <i className='text-danger'><BsXCircleFill size={55} /></i>,
//   warning: <i className='text-warning'><BsExclamationCircleFill size={55} /></i>,
//   question: <i className='text-info'><BsQuestionCircleFill size={55} /></i>,
// }

// const Alert = ({
//   title,
//   showCloseX,
//   isOpen = false,
//   subtitle,
//   onClosed,
//   size = 'md',
//   type,
//   closeButton,
//   submitButton,
//   fullscreen,
//   needFillConfirmation
// }: I_AlertObject) => {
//   const [showAlert, setShowAlert] = useState(isOpen);

//   const toggle = () => setShowAlert(!showAlert);

//   useEffect(() => setShowAlert(isOpen), [isOpen])

//   const buttons = [];

//   if (closeButton) {
//     buttons.push(<Button
//       key="closeButton"
//       color="primary2"
//       {...closeButton}
//       onClick={() => {
//         toggle();
//         closeButton.onClick?.();
//       }}>{closeButton.value || "Cerrar"}</Button>
//     )
//   }

//   if (submitButton) {
//     buttons.push(<Button
//       key="submitButton"
//       color="primary"
//       {...submitButton}
//       onClick={() => {
//         !needFillConfirmation && toggle();
//         submitButton.onClick?.();
//       }}>{submitButton.value}</Button>
//     )
//   }

//   return (
//     <Modal
//       size={size}
//       isOpen={showAlert}
//       onClosed={onClosed}
//       backdrop="static"
//       fullscreen={fullscreen || false}
//     >
//       <ModalHeader className='border-0 pb-0 flex-column-reverse'
//         toggle={showCloseX ? toggle : undefined}
//       >
//         <div className='justify-content-center p-3'>{alertType[type!]}</div>
//       </ModalHeader>
//       <ModalBody className="text-center">
//         {title && <h3 className='mb-4'>{title}</h3>}
//         {subtitle && <div className='mb-0 text-muted'>{subtitle}</div>}
//       </ModalBody>
//       <ModalFooter>{buttons}</ModalFooter>
//     </Modal>
//   )
// }

// export default Alert;
