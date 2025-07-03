import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
    className?: string
} & ButtonProps

export const Button: React.FC<ButtonProps> = ({ className, children, ...rest }) => {
    return (
        <button className={className} {...rest}>
            {children}
        </button>
    );
};
