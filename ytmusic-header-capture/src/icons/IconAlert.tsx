import React from "react"
import { GrCircleAlert } from "react-icons/gr";
import { BaseIcon } from "./BaseIcon"

interface Props {
	className?: string
	color?: string
}

export const IconAlert = ({className, color}: Props) => {
	return (
		<BaseIcon className={className} color={color}>
			<GrCircleAlert/>
		</BaseIcon>
	)
}

