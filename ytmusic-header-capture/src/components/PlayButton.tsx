import React from "react"
import { IconPlay } from "../icons/IconPlay"

interface Props {
	width?: string
	height?: string
	onClick: () => void
}

export const PlayButton = ({width, height, onClick}: Props) => {
	return (
		<button onClick={onClick} className = {`flex items-center justify-center ${width ?? "w-16"} ${height ?? "h-16"} rounded-full bg-white`}>
			<IconPlay className="ml-1 w-5 h-5 text-dark"/>	
		</button>
	)	
}
