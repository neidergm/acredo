
import { Spinner, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { T_LoaderProps } from '../../hooks/useLoader';

// type T_Props = {
//     onClosed?: () => void;
//     isOpen: boolean;
//     title?: string | JSX.Element | JSX.Element[];
//     subtitle?: string | JSX.Element | JSX.Element[] | null | false;
//     size?: 'sm' | 'md' | 'lg' | 'xl';
//     loaderAsModal?: boolean;
//     children?: JSX.Element | JSX.Element[] | string | null;
// }

type T_Props = T_LoaderProps;

const Loader = ({
    onClosed, onOpened,
    title,
    isOpen = false,
    loaderAsModal = true,
    size,
    children, 
}: T_Props) => {

    if (!loaderAsModal) {
        return <div className='text-center w-100 h-100'><Spinner role="status" size={size} />{children}</div>
    }

    return (
        <Modal
            onClosed={onClosed}
            onOpened={onOpened}
            centered
            contentClassName='border-0 pt-2 pb-2'
            isOpen={isOpen}
            backdrop="static"
            size={size || "sm"}
        >
            {title && <ModalHeader className='justify-content-center border-0 pt-4 pb-0'>{title}</ModalHeader>}
            <ModalBody className='text-center'>
                <Spinner role="status" />
            </ModalBody>
            {children && <ModalFooter className='justify-content-center border-0 pb-4 pt-0' >{children}</ModalFooter>}
        </Modal>
    );
};

export default Loader;