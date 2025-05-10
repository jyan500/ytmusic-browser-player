import React from "react"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { BaseIcon } from "./BaseIcon"

interface Props {
	className?: string
	color?: string
}

export const IconLeftArrow = ({className, color}: Props) => {
	return (
		<BaseIcon className={className} color={color}>
			<MdOutlineKeyboardArrowLeft/>
		</BaseIcon>
	)
}

