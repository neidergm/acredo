import React from 'react'
import { DropdownItem, DropdownItemProps, DropdownMenu, UncontrolledDropdown } from 'reactstrap'

type T_Option = {
    text: string | JSX.Element,
    click?: () => void,
    className?: string,
    icon?: any,
    optionProps?: Omit<DropdownItemProps, "onClick">
    disabled?: boolean,
}

type T_Props = {
    children: JSX.Element;
    options: Array<T_Option>
}

const CustomDropdown = ({
    children, options
}: T_Props) => {
    return (
        <UncontrolledDropdown >
            {children}
            <DropdownMenu className='border border-1 shadow-3 rounded-3 mt-1 py-3'>
                {
                    options.map(({ optionProps, ...option }, idx) => {
                        return <DropdownItem onClick={() => option.click?.()} {...optionProps} key={idx}>
                            <div className='d-flex gap-3 text-muted align-items-center'>
                                {option.icon} <span className='flex-grow-1'>{option.text}</span>
                            </div>
                        </DropdownItem>
                    })
                }
            </DropdownMenu>
        </UncontrolledDropdown>
    )
}

export default CustomDropdown;
