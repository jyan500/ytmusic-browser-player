import React from "react"

interface Props {
	onClick: (e: React.MouseEvent) => void
	message: string
}

export const NavButton = ({onClick, message}: Props) => {
	return (
		<button onClick={onClick}>{message}</button>
	)	
}
