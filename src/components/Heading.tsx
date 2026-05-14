import type { PropsWithChildren } from "react"
import classnames from "classnames";
import { Stack } from "react-bootstrap";
import { LuChevronLeft } from "react-icons/lu";
import { Button } from "react-bootstrap";

type Props = PropsWithChildren<{
    subText?: string;
    className?: string;
    withBackButton?: boolean;
}>

const Heading = ({
    subText,
    children,
    className,
    withBackButton = true,
}: Props) => {
    return (
        <Stack direction="horizontal" className="align-items-center mb-6 gap-3">
            {withBackButton && (
                <div>
                    <Button
                        size="sm"
                        variant="outline-dark"
                        className="opacity-25 p-1 lh-1"
                        onClick={() => window.history.back()}
                    >
                        <LuChevronLeft size={22} />
                    </Button>
                </div>
            )}
            <div>
                <h1 className={classnames("h3 mb-0", className)} >
                    {children}
                </h1>
                <span className="eyebrow">{subText}</span>
            </div>
        </Stack>
    )
}

export default Heading