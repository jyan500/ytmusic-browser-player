import React from "react"
import { setShowQueuedTrackList } from "../../slices/queuedTrackListSlice"
import { setIsAutoPlay } from "../../slices/audioPlayerSlice"
import { TrackList, Props as TrackListPropType } from "../TrackList"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { Track } from "../../types/common"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { TRANSITION_TRANSFORM, PADDING_AVOID_AUDIO_PLAYER_OVERLAP, OVERFLOW_MAX_HEIGHT } from "../../helpers/constants"
import { IconDownArrow } from "../../icons/IconDownArrow"
import { IconUpArrow } from "../../icons/IconUpArrow"
import { Switch } from "../elements/Switch"

export const QueuedTrackList = () => {
	const dispatch = useAppDispatch()
	const { showQueuedTrackList: isOpen, playlist } = useAppSelector((state) => state.queuedTrackList)
	const { isAutoPlay, queuedTracks, isShuffling, shuffledQueuedTracks } = useAppSelector((state) => state.audioPlayer)
	return (
		<div className = {`${isOpen ? `translate-y-0`: "translate-y-full"} ${TRANSITION_TRANSFORM} fixed bottom-0 left-0 bg-dark w-full ${PADDING_AVOID_AUDIO_PLAYER_OVERLAP} ${OVERFLOW_MAX_HEIGHT}`}>
			<div className = "p-2 space-y-2">
				<div className = "justify-between flex flex-row items-center">
					<p className = "text-lg">Playing from: <span className = "text-gray-300">{playlist?.title ?? ""}</span></p>
					<button onClick={() => dispatch(setShowQueuedTrackList(!isOpen))}>{isOpen ? <IconDownArrow/> : <IconUpArrow/>}</button>
				</div>
				<div className = "flex flex-row items-center">
					<div className = "flex flex-col gap-y-2">
						<p>Autoplay</p>	
						<p>Add similar content to the end of the queue</p>	
					</div>
					<div>
						<Switch checked={isAutoPlay} onChange={() => {
							dispatch(setIsAutoPlay(!isAutoPlay))	
						}}/>
					</div>
				</div>
				<InfiniteScrollList<Track, Omit<TrackListPropType, "data">> props={{
					inQueueTrackList: false	
				}} data={isShuffling ? shuffledQueuedTracks : queuedTracks} component={TrackList}/>
			</div>
		</div>
	)
}

