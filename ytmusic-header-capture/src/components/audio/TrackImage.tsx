import React from "react"
import { Track } from "../../types/common"
import { IconMusicNote } from "../../icons/IconMusicNote"

interface Props {
	track: Track | null | undefined
}

export const TrackImage = ({track}: Props) => {
	return (
		<>	
			{
				track?.thumbnails ? (
					<img alt={"audio avatar"} className = "w-full h-full object-cover" src={track?.thumbnails?.[0]?.url} />
				) : 
				<div className = "flex items-center justify-center w-full h-full">
					<span className="text-xl text-gray-600">
						<IconMusicNote/>
					</span>
				</div>
			}
		</>
	)
}

