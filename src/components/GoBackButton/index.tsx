import { useNavigate } from "react-router";
import { Button } from 'reactstrap';
import { BsArrowLeftShort } from 'react-icons/bs';

export const GoBackButton = ({ value = "Atrás" }: { value?: string }) => {
    const navigate = useNavigate();

    return (
        <Button onClick={() => navigate(-1)}
            color="light"
            className="rounded-pill d-flex align-items-center d-print-none"
        >
            <BsArrowLeftShort size={28} /> <small className="pb-1 pe-2">{value}</small>
        </Button>
    )
}
