import React from 'react';
import { Spinner } from 'reactstrap';

const Loader = ({ className }: { className?: string }) => {
    return (
        <div className={`w-100 d-flex justify-content-center align-items-center ${className || ""}`}>
            <Spinner animation="border" role="status" />
        </div>
    );
};

export default Loader;