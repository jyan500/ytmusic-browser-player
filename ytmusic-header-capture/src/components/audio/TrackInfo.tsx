import React from "react"
import { IconMusicNote } from "../../icons/IconMusicNote"
import { Track, OptionType } from "../../types/common"
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"

interface Props {
	track: Track | null | undefined 
}

export const TrackInfo = ({track}: Props) => {
	return (
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
	)
}

