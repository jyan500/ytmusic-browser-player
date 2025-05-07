import React from "react"
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BaseIcon } from "./BaseIcon"

interface Props {
	className?: string
	color?: string
}

export const IconRightArrow = ({className, color}: Props) => {
	return (
		<BaseIcon className={className} color={color}>
			<MdOutlineKeyboardArrowRight/>
		</BaseIcon>
	)
}

