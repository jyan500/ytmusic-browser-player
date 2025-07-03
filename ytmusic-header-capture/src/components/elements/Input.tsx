import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

type Props = {
    className?: string
} & InputProps

export const Input: React.FC<InputProps> = ({ className, ...rest }) => {
    return (
        <input
            className={`focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md w-full h-8 ${className}`}
            {...rest} // Spread all native input props (e.g., onChange, value, type)
        />
    );
};
