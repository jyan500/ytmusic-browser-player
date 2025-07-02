import React from "react"

interface Props {
	onClick: () => void
	text: string
	children?: React.ReactNode
	className?: string
}

export const PillButton = ({onClick, text, children, className}: Props) => {
	return (
        <button onClick={(e) => onClick()} className={`${className} flex flex-row gap-x-2 items-center bg-white text-black px-3 py-1 rounded-md`}>{children}<p className = "font-semibold">{text}</p></button>
	)	
}