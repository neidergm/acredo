import { Card as CardB, type CardProps } from 'reactstrap';
import classnames from 'classnames';

const Card = ({ className, children, ...props }: CardProps) =>
    <CardB body {...props} className={classnames("px-3 rounded-4 border-0 shadow-1", className)}>
        {children}
    </CardB>

export default Card;
