// import { useEffect, useState } from 'react';
// import { Button, Modal } from 'react-bootstrap';
// import { CheckCircleFill, ExclamationCircleFill, InfoCircleFill, QuestionCircleFill, XCircleFill } from './../Icons';

// interface Props {
//     type: string,
//     open: boolean,
//     size?: 'sm' | 'lg' | 'xl' | undefined,
//     body: any,
//     title: any,
//     onDidClosed: () => void,
//     className?: string,
//     closeButton: { color?: string, text: string, disabled?: boolean, onClick?: () => void } ,
//     submitButton?: { color?: string, text: string, disabled?: boolean, onClick: (callback?: () => void) => void }
//     centered?: boolean
// }

// export const alertType: { [key: string]: any } = {
//     "question": <i className='text-info'><QuestionCircleFill size={50} /></i>,
//     "success": <i className="text-success"><CheckCircleFill size={50} /></i>,
//     "danger": <i className="text-danger"><XCircleFill size={50} /></i>,
//     "warning": <i className='text-warning'><ExclamationCircleFill size={50} /></i>,
//     "info": <i className='text-info'><InfoCircleFill size={50} /></i>
// }

// function Alert(props: Props) {

//     const { open, className, centered, onDidClosed, size, closeButton, submitButton, body, type, title } = props;

//     const [show, setShow] = useState(open);

//     const _handleClose = () => {
//         setShow(!show);
//     }

//     const onExited = () => {
//         onDidClosed?.();
//     }

//     useEffect(() => {
//         // if (open) {
//         setShow(open)
//         // };
//     }, [open])

//     return (
//         <Modal
//             dialogClassName={className || ""}
//             className="inner-modal"
//             backdropClassName="inner-modal"
//             show={show}
//             onHide={_handleClose}
//             backdrop="static"
//             keyboard={false}
//             centered={centered ?? true}
//             onExited={onExited}
//             contentClassName={"p-0 p-md-2"}
//         >
//             <Modal.Header className="border-0 mt-2 flex-column">
//                 <div className='text-center mt-2 mb-4'>
//                     {alertType[type]}
//                 </div>
//                 <Modal.Title className="text-center text-secondary">{title}</Modal.Title>
//             </Modal.Header>
//             {body && <Modal.Body className="text-center">{body}</Modal.Body>}
//             <Modal.Footer className="border-0 mb-2 ">
//                 <Button type="button" variant={closeButton?.color ?? "dark"} onClick={_handleClose} className={submitButton ? "me-auto" : "mx-auto"}>
//                     {closeButton?.text || "Cerrar"}
//                 </Button>
//                 {submitButton && <Button variant={submitButton?.color || "dark"} onClick={() => {
//                     submitButton.onClick?.(_handleClose);
//                 }}
//                     disabled={!!(submitButton.disabled)}
//                 >
//                     {submitButton?.text}
//                 </Button>}
//             </Modal.Footer>
//         </Modal >
//     );
// }

// export default Alert;

import React from 'react'

export const Alert = () => {
  return (
    <div>Alert</div>
  )
}
