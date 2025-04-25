import React from "react"
import { IoMdVolumeOff } from "react-icons/io"
import { BaseIcon } from "./BaseIcon"

interface Props {
	className?: string
	color?: string
}

export const IconVolumeOff = ({className, color}: Props) => {
	return (
		<BaseIcon className={className} color={color}>	
			<IoMdVolumeOff/>
		</BaseIcon>
	)	
}

