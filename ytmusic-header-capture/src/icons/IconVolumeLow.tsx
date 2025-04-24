import React from "react"
import { IoMdVolumeLow } from "react-icons/io"
import { BaseIcon } from "./BaseIcon"

interface Props {
	className?: string
	color?: string
}

export const IconVolumeLow = ({className, color}: Props) => {
	return (
		<BaseIcon className={className} color={color}>	
			<IoMdVolumeLow/>
		</BaseIcon>
	)	
}

