import React from "react"
import { IconMusicNote } from "../../icons/IconMusicNote"
import { ContainsArtists, Track, OptionType } from "../../types/common"
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"
import { TrackImage } from "./TrackImage"
import { ArtistDescription } from "../ArtistDescription"
import { setShowQueuedTrackList} from "../../slices/queuedTrackListSlice"

interface Props {
	track: Track | null | undefined 
}

export const TrackInfo = ({track}: Props) => {
	const dispatch = useAppDispatch()
	const { showQueuedTrackList } = useAppSelector((state) => state.queuedTrackList)

	const closeTracklist = () => {
		dispatch(setShowQueuedTrackList(false))
	}

	return (
		<div className = "flex items-center gap-4">
			<div className = "w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden">	
				<TrackImage track={track}/>
			</div>	
			<div className = "w-40">
				<p className = "font-bold truncate">{track?.title}</p>	
				<p className = "text-sm text-gray-400 truncate"><ArtistDescription closeTracklist={closeTracklist} content={track as ContainsArtists}/></p>
				{
	                /* track?.artists?.map((artist: OptionType) => {
	                    return (
	                        <p className = "text-sm text-gray-400 truncate" key={artist.id}>{artist.name}</p>
	                    )
	                })
	                */
	            }
            </div>
		</div>
	)
}

