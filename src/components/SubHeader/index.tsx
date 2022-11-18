import { GoBackButton } from "../GoBackButton"

export const SubHeader = ({ text, children, showBackButton }: { text: string, children?: any, showBackButton?: boolean }) => {
    return (
        <div className="container mt-4 mb-4 pt-3 pb-2 w-100 d-flex align-items-center">
            <h4 className="mb-0 text-secondary border-start pt-2 pb-2 ps-3 border-5 border-success">{text}</h4>
            {showBackButton && <div className="ms-auto"><GoBackButton /></div>}
            {children}
        </div>
    )
}
