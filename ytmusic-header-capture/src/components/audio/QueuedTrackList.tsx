import React, {useState} from "react"
import { setShowQueuedTrackList } from "../../slices/queuedTrackListSlice"
import { setIsAutoPlay } from "../../slices/audioPlayerSlice"
import { TrackList, Props as TrackListPropType } from "../TrackList"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { Track, QueueItem } from "../../types/common"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { TRANSITION_TRANSFORM, PADDING_AVOID_AUDIO_PLAYER_OVERLAP, OVERFLOW_MAX_HEIGHT } from "../../helpers/constants"
import { IconDownArrow } from "../../icons/IconDownArrow"
import { IconUpArrow } from "../../icons/IconUpArrow"
import { Switch } from "../elements/Switch"
import { FilterButton } from "../elements/FilterButton"
import { QUEUED_TRACK_LIST_Z_INDEX } from "../../helpers/constants"

export const QueuedTrackList = () => {
	const dispatch = useAppDispatch()
	const { showQueuedTrackList: isOpen, playlist } = useAppSelector((state) => state.queuedTrackList)
	const { isAutoPlay, suggestedTracks, queuedTracks, isShuffling, shuffledQueuedTracks } = useAppSelector((state) => state.audioPlayer)
	const tabs = [
		"Up Next",
		"Suggestions" 
	]
	const [ tabIndex, setTabIndex ] = useState(0)

	const upNextTab = () => {
		return (
			<div className = "flex flex-col gap-y-2">
				<div className = "flex flex-row items-start gap-x-2">
					<div className = "flex flex-col gap-y-2">
						<p>Autoplay</p>	
						<p>Add similar content to the end of the queue</p>	
					</div>
					<div className = "mt-1">
						<Switch checked={isAutoPlay} onChange={() => {
							dispatch(setIsAutoPlay(!isAutoPlay))	
						}}/>
					</div>
				</div>
				<div>
					<InfiniteScrollList<QueueItem, Omit<TrackListPropType, "data">> props={{
						inQueueTrackList: true,
						playlist: playlist
					}} data={isShuffling ? shuffledQueuedTracks : queuedTracks} component={TrackList}/>
				</div>
			</div>	
		)
	}

	const suggestionsTab = () => {
		return (
			<div>
				<div>
					<InfiniteScrollList<Track, Omit<TrackListPropType, "data">> props={{
						inQueueTrackList: false,
						playlist: playlist
					}} data={suggestedTracks} component={TrackList}/>
				</div>
			</div>
		)
	}

	const showTab = () => {
		if (tabIndex === 0){
			return upNextTab()
		}
		else if (tabIndex === 1){
			return suggestionsTab()
		}
		return upNextTab()
	}

	return (
		<div className = {`${QUEUED_TRACK_LIST_Z_INDEX} ${isOpen ? `translate-y-0`: "translate-y-full"} ${TRANSITION_TRANSFORM} fixed bottom-0 left-0 bg-dark w-full overscroll-contain ${PADDING_AVOID_AUDIO_PLAYER_OVERLAP} ${OVERFLOW_MAX_HEIGHT}`}>
			{/* width 95% is to prevent the scrollbar from showing*/}
			<div className = "p-2 space-y-2">
				<div className = "justify-between flex flex-row items-center">
					<p className = "text-lg">Playing from: <span className = "text-gray-300">{playlist?.title ?? ""}</span></p>
					<button onClick={() => dispatch(setShowQueuedTrackList(!isOpen))}>{isOpen ? <IconDownArrow/> : <IconUpArrow/>}</button>
				</div>
				<div className = "flex flex-row items-start gap-x-2">
					{tabs.map((t, index) => {
						return (
							<FilterButton key={t} isActive={index === tabIndex} onClick={() => setTabIndex(index)}>
								<span>{t}</span>
							</FilterButton>
						)		
					})}
				</div>
				{
					showTab()
				}
			</div>
		</div>
	)
}

