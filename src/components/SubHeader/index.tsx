import { GoBackButton } from "../GoBackButton"
import classnames from 'classnames';

export const SubHeader = (
    { text, children, showBackButton, className }:
        { text: string | JSX.Element, children?: any, showBackButton?: boolean, className?: string }
) => {
    return (
        <div className={classnames("d-flex container-fluid gap-2 mb-5", className)}>
            <div className="d-flex flex-grow-1 align-items-center border-start border-5 border-success gap-3">
                <h4 className="mb-0 text-secondary pt-2 pb-2 ps-3 ">{text}</h4>
                {showBackButton && <div className="ms-auto d-none d-md-block"><GoBackButton /></div>}
            </div>
            {children}
        </div>
    )
}
