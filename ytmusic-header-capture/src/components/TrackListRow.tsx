import React, { useState, useRef } from "react"
import { Track, QueueItem, Playlist } from "../types/common"
import { getThumbnail } from "../helpers/functions"
import { IconVerticalMenu } from "../icons/IconVerticalMenu"
import { TrackDropdown } from "./dropdowns/TrackDropdown"
import { useClickOutside } from "../hooks/useClickOutside"
import { ImagePlayButton } from "./ImagePlayButton"

interface Props {
	track: Track | QueueItem
	shouldHighlightRow: boolean
	key: string
	rowContent: React.ReactNode 
	triggerLoadTrack: () => void
	playlistId?: string
	showPauseButton: boolean
	thumbnail: string
}

export const TrackListRow = ({
	track, 
	shouldHighlightRow, 
	showPauseButton, 
	triggerLoadTrack, 
	rowContent, 
	playlistId,
	key, 
	thumbnail
}: Props) => {

    const [showDropdown, setShowDropdown] = useState(false)
    const menuDropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const onClickOutside = () => {
        setShowDropdown(false)  
    }

    useClickOutside(menuDropdownRef, onClickOutside, buttonRef)

	return (
		<li 
            tabIndex={0} 
            key={key} 
            className={`relative hover:cursor-pointer group flex flex-row justify-between items-center ${shouldHighlightRow ? "bg-orange-secondary" : ""}`}>
                <div className = "flex flex-row gap-x-2">
                    <ImagePlayButton 
                        playButtonWidth={"w-6"}
                        playButtonHeight={"h-6"}
                        imageWidth={"w-24"}
                        imageHeight={"h-16"}
                        isAvailable={track.isAvailable ?? true}
                        showPauseButton={showPauseButton}
                        onPress={triggerLoadTrack}
                        imageURL={thumbnail}
                    />
                    <div className = "py-1 flex flex-col gap-y-2 truncate overflow-hidden">
                        {rowContent}
                    </div>
                </div>
                <div className = "relative pr-2 w-12 flex-shrink-0 flex justify-end items-center">
                    <p className = {`absolute ${showDropdown ? "invisible" : "group-hover:invisible"}`}>{track.duration ?? ""}</p>
                    <button ref={buttonRef} onClick={() => {
                        setShowDropdown(!showDropdown)}
                    } className="hover:opacity-60 invisible group-hover:visible absolute">
                        <IconVerticalMenu/>
                    </button>
                    {
                    showDropdown ? 
	                    <TrackDropdown playlistId={playlistId} videoId={track.videoId} setVideoId={track.setVideoId} ref={menuDropdownRef} closeDropdown={() => setShowDropdown(false)}/>
	                    : null
	                }
                </div>

            </li>
	)	
}
