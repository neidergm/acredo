import { Children } from 'react';
import {
    Modal as ModalB,
    ModalHeader as ModalHeaderB,
    ModalBody as ModalBodyB,
    ModalFooter as ModalFooterB,
    ModalHeaderProps,
    ModalProps,
    ModalFooterProps
} from 'reactstrap';
import classnames from 'classnames';

type T_ModalToggleAction = (toggle?: boolean) => void;

type T_ModalHeaderProps = {
    textCenter?: boolean;
    toggle?: T_ModalToggleAction;
} & ModalHeaderProps;

export type T_ModalJSON = T_ModalHeaderProps & ModalFooterProps & ModalProps;

export const closeModal = (
    setStateCallback: (currentState: any) => any,
    onClosedCallback?: () => any
) => {


    return setStateCallback((currentState: T_ModalJSON) => {
        const extra = {onClosed: onClosedCallback || currentState.onClosed}
        if (!(extra.onClosed)) delete extra.onClosed;

        return { ...currentState, isOpen: false, ...extra }
    });
}

export const ModalHeader = ({ toggle, textCenter, ...props }: T_ModalHeaderProps) =>
    <ModalHeaderB
        toggle={toggle ? (() => toggle()) : undefined}
        style={{ border: 0, justifyContent: textCenter ? "center" : "left" }}
        {...props}
    />

export const ModalFooter = (props: ModalFooterProps) =>
    <ModalFooterB {...props} style={{ border: 0, justifyContent: Children.count(props.children) > 1 ? "space-between" : "center" }} />

export const Modal = ({ toggle, className, fullscreen = "sm", ...props }: ModalHeaderProps & { toggle?: T_ModalToggleAction; }) => {
    return <ModalB
        contentClassName={classnames('p-md-2 p-xl-3 border-0', className)}
        fullscreen={fullscreen}
        keyboard={false}
        centered
        {...props}
        toggle={toggle ? (() => toggle()) : undefined}
    />
};

export const ModalBody = ModalBodyB;
