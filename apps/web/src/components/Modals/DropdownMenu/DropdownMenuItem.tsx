import { FC } from "react";

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    className?: string;
}

const DropdownMenuItem: FC<DropdownMenuItemProps> = (props) => {
    const className = props.className ? `DropdownMenu-item ${props.className}` : "DropdownMenu-item";
    return (
        <div {...props} className={className}>
            {props.children}
        </div>
    );
};

export default DropdownMenuItem;
