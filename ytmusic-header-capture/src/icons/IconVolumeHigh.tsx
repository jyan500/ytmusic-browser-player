import React from "react"
import { IoMdVolumeHigh } from "react-icons/io"
import { BaseIcon } from "./BaseIcon"

interface Props {
	className?: string
	color?: string
}

export const IconVolumeHigh = ({className, color}: Props) => {
	return (
		<BaseIcon className={className} color={color}>	
			<IoMdVolumeHigh/>
		</BaseIcon>
	)	
}

