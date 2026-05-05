import { DropdownItem, type DropdownItemProps, DropdownMenu, UncontrolledDropdown } from 'reactstrap'

type T_Option = {
    text: string | JSX.Element,
    click?: () => void,
    className?: string,
    icon?: JSX.Element,
    optionProps?: Partial<DropdownItemProps>
    disabled?: boolean,
}

type T_Props = {
    children: JSX.Element | JSX.Element[];
    options: Array<T_Option>,
    group?: boolean
}

const CustomDropdown = ({
    children, options, group
}: T_Props) => {
    return (
        <UncontrolledDropdown group={group || false}>
            {children}
            <DropdownMenu className='border border-1 shadow-3 mt-1 rounded-3 py-3'>
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
