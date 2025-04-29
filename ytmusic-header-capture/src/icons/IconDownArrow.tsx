import React from "react"
import { IoIosArrowDown } from "react-icons/io";
import { BaseIcon } from "./BaseIcon"

interface Props {
	className?: string
	color?: string
}

export const IconDownArrow = ({className, color}: Props) => {
	return (
		<BaseIcon className={className} color={color}>
			<IoIosArrowDown/>
		</BaseIcon>
	)
}

