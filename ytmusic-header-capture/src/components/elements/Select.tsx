import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

type Props = {
    className?: string
} & SelectProps

export const Select: React.FC<SelectProps> = ({ className, children, ...rest }: Props) => {
    return (
        <select className = "focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md w-full h-8 p-2" style={{backgroundColor: "var(--color-dark-secondary)"}} {...rest}>
            {children}
        </select>
    );
};
