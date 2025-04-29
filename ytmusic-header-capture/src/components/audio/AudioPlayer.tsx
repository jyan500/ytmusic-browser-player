import React, { useState } from "react"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { IconUpArrow } from "../../icons/IconUpArrow"
import { IconDownArrow } from "../../icons/IconDownArrow"
import { TrackInfo } from "./TrackInfo"
import { TrackImage } from "./TrackImage"
import { Controls } from "./Controls"
import { ProgressBar } from "./ProgressBar"
import { VolumeControl } from "./VolumeControl"
import { Playlist } from "./Playlist"
import { setShowQueuedTrackList } from "../../slices/queuedTrackListSlice"
import { TRANSITION_TRANSFORM } from "../../helpers/constants"

export const AudioPlayer = () => {
	const { showQueuedTrackList } = useAppSelector((state) => state.queuedTrackList)
	const dispatch = useAppDispatch()
	const { showAudioPlayer: isOpen, currentTrack } = useAppSelector((state) => state.audioPlayer)
	return (
		<div className = {`${isOpen ? `translate-y-0` : "translate-y-full"} ${TRANSITION_TRANSFORM} w-full fixed bottom-0 left-0`}>
			<ProgressBar/>
			<div className = "flex flex-row gap-4 items-center text-white p-[0.5rem_10px] min-h-8 bg-dark">
				<div className = "w-3/8">
					<TrackInfo track={currentTrack}/>
				</div>
				<div className = "w-5/8 flex flex-row items-center gap-2 m-auto">
					<Controls/>
					<div className = "w-28">
						<VolumeControl/>
					</div>
					<button onClick={() => dispatch(setShowQueuedTrackList(!showQueuedTrackList))}>{showQueuedTrackList ? <IconDownArrow/> : <IconUpArrow/>}</button>
				</div>
			</div>
		</div>	
	)
}
