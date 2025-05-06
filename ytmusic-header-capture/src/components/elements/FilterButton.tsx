import React from "react"

type FilterButtonProps = {
	isActive: boolean
	onClick: (e: React.MouseEvent) => void
	children: React.ReactNode
}

export const FilterButton = ({isActive, onClick, children}: FilterButtonProps) => {
	return (
		<button className = {`p-1.5 rounded-sm font-semibold hover:bg-orange-secondary hover:text-white ${isActive ? "text-white bg-orange-secondary font-bold" : ""} transition duration-100 ease-in-out`} onClick={onClick}>{children}</button>
	)
}
