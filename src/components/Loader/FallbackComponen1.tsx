import { Spinner } from 'reactstrap';

const FallbackComponen1 = () => {
    return (
        <div className='w-100 h-100 d-flex justify-content-center align-items-center position-absolute'>
            <Spinner color='success' animation="border" role="status" />
        </div>
    );
};

export default FallbackComponen1;