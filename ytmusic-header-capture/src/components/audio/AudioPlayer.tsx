import React, { useState, useRef } from "react"
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
import { AUDIO_PLAYER_Z_INDEX, TRANSITION_TRANSFORM } from "../../helpers/constants"
import { TrackDropdown } from "../dropdowns/TrackDropdown"
import { IconVerticalMenu } from "../../icons/IconVerticalMenu"
import { useClickOutside } from "../../hooks/useClickOutside"

export const AudioPlayer = () => {
	const { playlist, showQueuedTrackList } = useAppSelector((state) => state.queuedTrackList)
	const dispatch = useAppDispatch()
	const { showAudioPlayer: isOpen, currentTrack } = useAppSelector((state) => state.audioPlayer)

    const [showDropdown, setShowDropdown] = useState(false)
    const menuDropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const onClickOutside = () => {
        setShowDropdown(false)  
    }

    useClickOutside(menuDropdownRef, onClickOutside, buttonRef)

	return (
		<div className = {`${AUDIO_PLAYER_Z_INDEX} ${isOpen ? `translate-y-0` : "translate-y-full"} ${TRANSITION_TRANSFORM} w-full fixed bottom-0 left-0`}>
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
					<div className = "relative inline-block">
						<button ref={buttonRef} onClick={() => {
	                        setShowDropdown(!showDropdown)}
	                    } className="hover:opacity-60">
	                        <IconVerticalMenu/>
	                    </button>
	                    {
	                    	currentTrack ? 
		                    <TrackDropdown showDropdown={showDropdown} displayAbove={true} playlistId={playlist?.playlistId} videoId={currentTrack.videoId} setVideoId={currentTrack.setVideoId} ref={menuDropdownRef} closeDropdown={() => setShowDropdown(false)}/>
		                    : null
		                }
		            </div>
					<button onClick={() => dispatch(setShowQueuedTrackList(!showQueuedTrackList))}>{showQueuedTrackList ? <IconDownArrow/> : <IconUpArrow/>}</button>
				</div>
			</div>
		</div>	
	)
}
