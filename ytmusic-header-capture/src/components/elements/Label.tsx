import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<LabelProps> = ({ children, ...rest }) => {
    return (
        <label className="font-semibold" {...rest}>
            {children}
        </label>
    );
};