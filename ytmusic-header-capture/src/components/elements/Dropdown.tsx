import React, { useRef } from "react"
import { DROPDOWN_Z_INDEX } from "../../helpers/constants"
import { IconClose } from "../../icons/IconClose"

type Props = {
	children: React.ReactNode
	closeDropdown?: () => void
	zIndex?: string
	className?: string 
}

export const Dropdown = React.forwardRef<HTMLDivElement, Props>(({className, children, closeDropdown, zIndex}, ref) => {
	return (
		<div ref = {ref} className={`${zIndex ?? DROPDOWN_Z_INDEX} absolute w-48 rounded-md bg-black ${className}`}>
		{/*	{closeDropdown ? (
				<button 
					className = "absolute top-0 right-0 mr-1 mt-1"
					onClick={(e) => {
						e.preventDefault()
						closeDropdown()
					}}
				>
					<IconClose className = "w-4 h-4"/>
				</button>
			) : null}*/}
			<div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
				{children}
			</div>
		</div>
	)
})

