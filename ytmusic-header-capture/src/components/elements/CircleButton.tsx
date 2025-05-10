import React from "react"

interface Props {
	onClick: () => void
	disabled?: boolean
	children: React.ReactNode
}

export const CircleButton = ({onClick, disabled = false, children}: Props) => {
	return (
		<button onClick={onClick} disabled={disabled} className = {`${disabled ? "opacity-6" : ""} border p-2 border-white rounded-full flex items-center justify-center`}>
			{children}
		</button>
	)
}
