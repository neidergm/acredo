import { useNavigate } from "react-router";
import { Button } from 'reactstrap';
import { ArrowLeftShort } from "../Icons";

export const GoBackButton = ({ value = "Atrás" }: { value?: string }) => {
    const navigate = useNavigate();

    return (
        <Button onClick={() => navigate(-1)}
            color="light"
            className="rounded-pill d-flex align-items-center d-print-none"
        >
            <ArrowLeftShort size={28} /> <small className="pb-1 pe-2">{value}</small>
        </Button>
    )
}
