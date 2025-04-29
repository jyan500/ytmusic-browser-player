import React from "react"
import { setShowQueuedTrackList } from "../../slices/queuedTrackListSlice"
import { TrackList } from "../TrackList"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { Track } from "../../types/common"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { PADDING_AVOID_AUDIO_PLAYER_OVERLAP, OVERFLOW_MAX_HEIGHT } from "../../helpers/constants"

export const QueuedTrackList = () => {
	const dispatch = useAppDispatch()
	const { showQueuedTrackList: isOpen } = useAppSelector((state) => state.queuedTrackList)
	const { queuedTracks } = useAppSelector((state) => state.audioPlayer)
	const transition = "transform transition-transform duration-500 ease-in-out"
	return (
		<div className = {`${isOpen ? `translate-y-0`: "translate-y-full"} ${transition} fixed bottom-0 left-0 bg-dark w-full ${PADDING_AVOID_AUDIO_PLAYER_OVERLAP} ${OVERFLOW_MAX_HEIGHT}`}>
			<div className = "p-2">
				<InfiniteScrollList<Track> data={queuedTracks ?? []} component={TrackList}/>
			</div>
		</div>
	)
}