import React from "react"
import { FaSearch } from "react-icons/fa";
import { BaseIcon } from "./BaseIcon"

interface Props {
	className?: string
	color?: string
}

export const IconSearch = ({className, color}: Props) => {
	return (
		<BaseIcon className={className} color={color}>
			<FaSearch/>
		</BaseIcon>
	)
}


