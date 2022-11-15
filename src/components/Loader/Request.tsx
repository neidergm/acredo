import { Modal, Spinner } from 'reactstrap';


interface Props {
    open: boolean,
    children?: any,
}

function Request({ open, children }: Props) {
    return (
        <div>
            <Modal
                show={open}
                backdrop="static"
                className='loader-request-modal'
                backdropClassName='loader-request-modal'
                keyboard={false}
                size={"sm"}
                centered={true}
                contentClassName={"p-0 p-md-2"}
            >
                <div className="text-center">
                    <Spinner animation="border" />
                    <div className='mt-2'>{children}</div>
                </div>
            </Modal >
        </div>
    );
}

export default Request;