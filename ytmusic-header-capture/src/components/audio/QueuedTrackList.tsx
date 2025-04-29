import React from "react"
import { setShowQueuedTrackList } from "../../slices/queuedTrackListSlice"
import { TrackList } from "../TrackList"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { Track } from "../../types/common"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { TRANSITION_TRANSFORM, PADDING_AVOID_AUDIO_PLAYER_OVERLAP, OVERFLOW_MAX_HEIGHT } from "../../helpers/constants"

export const QueuedTrackList = () => {
	const dispatch = useAppDispatch()
	const { showQueuedTrackList: isOpen, playlistTitle } = useAppSelector((state) => state.queuedTrackList)
	const { queuedTracks, isShuffling, shuffledQueuedTracks } = useAppSelector((state) => state.audioPlayer)
	return (
		<div className = {`${isOpen ? `translate-y-0`: "translate-y-full"} ${TRANSITION_TRANSFORM} fixed bottom-0 left-0 bg-dark w-full ${PADDING_AVOID_AUDIO_PLAYER_OVERLAP} ${OVERFLOW_MAX_HEIGHT}`}>
			<div className = "p-2 space-y-2">
				<p className = "text-lg">Playing from: <span className = "text-gray-300">{playlistTitle}</span></p>
				<InfiniteScrollList<Track> data={isShuffling ? shuffledQueuedTracks : queuedTracks} component={TrackList}/>
			</div>
		</div>
	)
}

