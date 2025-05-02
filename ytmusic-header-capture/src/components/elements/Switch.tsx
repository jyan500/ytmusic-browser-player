import { useState } from "react";

interface Props {
    id?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void 
    checked: boolean
}

export const Switch = ({id, onChange, checked}: Props) => {
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                id={id}
                type="checkbox"
                /* sr-only hides element visually but not from screen readers */
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
            />
                {/* switch body */}
                <div className="w-10 h-5 bg-gray-300 peer-checked:bg-blue rounded-full transition-colors"></div>
                {/* slider circle element */}
                <div
                className={`absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform ${
                checked ? "translate-x-5" : "translate-x-0"
                }`}
            />
        </label>
    )
}
