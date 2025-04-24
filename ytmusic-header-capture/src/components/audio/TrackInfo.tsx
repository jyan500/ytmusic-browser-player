import React from "react"
import { IconMusicNote } from "../../icons/IconMusicNote"
import { OptionType } from "../../types/common"
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"

export const TrackInfo = () => {
	const { currentTrack } = useAppSelector((state) => state.audioPlayer)
	return (
		<div className = "flex flex-row items-center gap-4">
			<div className = "w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden">	
			{
				currentTrack?.thumbnails ? (
					<img alt={"audio avatar"} className = "w-full h-full object-cover" src={currentTrack?.thumbnails?.[0]?.url} />
				) : 
				<div className = "flex items-center justify-center w-full h-full">
					<span className="text-xl text-gray-600">
						<IconMusicNote/>
					</span>
				</div>
			}
			</div>
			<div>
				<p className = "font-bold truncate max-w-64">{currentTrack?.title}</p>	
				{
                    currentTrack?.artists?.map((artist: OptionType) => {
                        return (
                            <p className = "text-sm text-gray-400" key={artist.id}>{artist.name}</p>
                        )
                    })
                }
			</div>
		</div>	
	)
}

