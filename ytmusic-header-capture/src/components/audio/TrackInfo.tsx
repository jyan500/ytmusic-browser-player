import React from "react"
import { IconMusicNote } from "../../icons/IconMusicNote"
import { Track, OptionType } from "../../types/common"
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"
import { TrackImage } from "./TrackImage"

interface Props {
	track: Track | null | undefined 
}

export const TrackInfo = ({track}: Props) => {
	return (
		<div className = "flex items-center gap-4">
			<div className = "w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden">	
				<TrackImage track={track}/>
			</div>	
			<div>
				<p className = "font-bold truncate max-w-64">{track?.title}</p>	
				{
	                track?.artists?.map((artist: OptionType) => {
	                    return (
	                        <p className = "text-sm text-gray-400" key={artist.id}>{artist.name}</p>
	                    )
	                })
	            }
            </div>
		</div>
	)
}

