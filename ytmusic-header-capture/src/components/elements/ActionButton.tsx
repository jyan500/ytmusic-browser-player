import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string
}

export const ActionButton = ({text, ...props}: ButtonProps) => {
	return (
		<button className = "hover:opacity-60 p-2 border border-white rounded-lg" {...props}>{text}</button>
	)
}