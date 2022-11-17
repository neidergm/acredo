
import { Spinner, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

type T_Props = {
    isOpen: boolean;
    title?: string | JSX.Element | JSX.Element[];
    subtitle?: string | JSX.Element | JSX.Element[];
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Loader = ({
    title,
    isOpen = false,
    subtitle,
    size = 'sm'
}: T_Props) => {
    return (
        <Modal
            centered
            contentClassName='border-0 pt-2 pb-2'
            isOpen={isOpen}
            backdrop="static"
            size={size}
        >
            {title && <ModalHeader className='justify-content-center border-0 pt-4 pb-0'>{title}</ModalHeader>}
            <ModalBody className='text-center'>
                <Spinner animation="border" role="status" />
            </ModalBody>
            {subtitle && <ModalFooter className='justify-content-center border-0 pb-4 pt-0' >{subtitle}</ModalFooter>}
        </Modal>
    );
};

export default Loader;