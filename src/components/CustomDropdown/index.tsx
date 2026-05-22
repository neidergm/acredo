import type { PropsWithChildren, ReactElement } from 'react';
import { ButtonGroup, Dropdown, type DropdownItemProps } from 'react-bootstrap';

type T_Option = {
    text: string | ReactElement,
    click?: () => void,
    className?: string,
    icon?: ReactElement,
    optionProps?: Partial<DropdownItemProps>
    disabled?: boolean,
}

type T_Props = PropsWithChildren<{
    options: Array<T_Option>,
    group?: boolean
}>

const CustomDropdown = ({ children, options, group }: T_Props) => {
    return (
        <Dropdown as={group ? ButtonGroup : undefined} >
            <Dropdown.Toggle as="div" className='d-flex align-items-center after-none' split={group} >
                {children}
            </Dropdown.Toggle>
            <Dropdown.Menu className='border border-1 shadow-3 mt-1 rounded-3 py-3'>
                {
                    options.map(({ optionProps, ...option }, idx) => {
                        return <Dropdown.Item onClick={() => option.click?.()} {...optionProps} key={idx}>
                            <div className='d-flex gap-3 text-muted align-items-center'>
                                {option.icon} <span className='flex-grow-1'>{option.text}</span>
                            </div>
                        </Dropdown.Item>
                    })
                }
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default CustomDropdown;
