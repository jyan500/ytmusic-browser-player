import React from "react"
import { IconMusicNote } from "../../icons/IconMusicNote"

interface Props {
	className?: string
	color?: string
}

export const PlaceholderThumbnail = ({className="w-full h-full", color="text-gray-600"}: Props) => {
	return (
		<div className = {`flex items-center justify-center ${className}`}>
			<span className={`text-xl ${color}`}>
				<IconMusicNote/>
			</span>
		</div>
	)
}
