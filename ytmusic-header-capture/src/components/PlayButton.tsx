import React from "react"
import { IconPlay } from "../icons/IconPlay"
import { IconPause } from "../icons/IconPause"

interface Props {
	width?: string
	height?: string
	iconWidthHeight?: string
	onClick: () => void
	isPlaying?: boolean
}

export const PlayButton = ({iconWidthHeight, width, height, onClick, isPlaying}: Props) => {
	return (
		<button onClick={onClick} className = {`flex items-center justify-center ${width ?? "w-16"} ${height ?? "h-16"} rounded-full bg-white`}>
			{
				isPlaying ? <IconPause className = {`${iconWidthHeight ?? "w-5 h-5"} text-dark`}/> : <IconPlay className={`ml-1 ${iconWidthHeight ?? "w-5 h-5"} text-dark`}/>	
			}
		</button>
	)	
}
