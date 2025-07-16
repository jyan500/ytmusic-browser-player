import React, { useState, useRef, useEffect } from "react"
import { Props as ImagePlayButtonProps, ImagePlayButton } from "./ImagePlayButton"
import { Thumbnail, SuggestedContent, Playlist as TPlaylist } from "../types/common"
import { useClickOutside } from "../hooks/useClickOutside"
import { IconVerticalMenu } from "../icons/IconVerticalMenu"
import { useLazyGetWatchPlaylistQuery } from "../services/private/playlists"
import { PlaylistDropdown } from "./dropdowns/PlaylistDropdown"
import { LoadingSpinner } from "./elements/LoadingSpinner"

interface HorizontalPlayableCardProps {
	title: string
	description: string
	content: SuggestedContent
	cardOnClick?: () => void
	imagePlayButtonProps?: ImagePlayButtonProps
	linkableDescription?: React.ReactNode
}

export const HorizontalPlayableCard = ({
	title,
	description,
	linkableDescription,
	content,
	cardOnClick, 
	imagePlayButtonProps,
}: HorizontalPlayableCardProps) => {
	const [showDropdown, setShowDropdown] = useState(false)	
	const [ triggerGetWatchPlaylist, { data, isError, isFetching }] = useLazyGetWatchPlaylistQuery()
	const buttonRef = useRef<HTMLButtonElement | null>(null)
	const dropdownRef = useRef<HTMLDivElement | null>(null)

	useClickOutside(dropdownRef, () => { setShowDropdown(false) }, buttonRef)

	const titleDescription = () => {
		return (
			<>
				<p className = {`font-semibold overflow-hidden truncate`}>{title}</p>
				{
					linkableDescription ? 
					linkableDescription :
					<p className = "text-gray-300 overflow-hidden truncate">{description}</p>
				}
			</>
		)
	}
	return (
		<>
			<div className={`flex flex-row gap-x-2 justify-between group`}>
				<div className = "flex flex-row gap-x-2 items-start w-4/5">
					<div className = {`${imagePlayButtonProps?.imageHeight ?? "h-16"} ${imagePlayButtonProps?.imageWidth ?? "w-16"}`}>
						{
							imagePlayButtonProps ? 
							<ImagePlayButton
								id={imagePlayButtonProps?.id}
								imageHeight={imagePlayButtonProps?.imageHeight ?? "h-32"}
								imageWidth={imagePlayButtonProps?.imageWidth ?? "w-32"}
								playButtonWidth={imagePlayButtonProps?.playButtonWidth ?? "w-6"}
								playButtonHeight={imagePlayButtonProps?.playButtonHeight ?? "h-6"}
								onPress={imagePlayButtonProps?.onPress}
								imageURL={imagePlayButtonProps?.imageURL}
								showPauseButton={imagePlayButtonProps?.showPauseButton}

							/> : null 
						}
					</div>
					{
						<button onClick={cardOnClick} className = {`w-3/4 line-clamp-3 text-left overflow-hidden truncate`}>
							{titleDescription()}
						</button>
					}
				</div>
				<div className = "relative pr-2 w-1/5 flex flex-shrink-0">
                    <button ref={buttonRef} onClick={() => {
                        setShowDropdown(!showDropdown)
                        triggerGetWatchPlaylist({
                        	videoId: content?.videoId ?? "",
                        })
                    }
                    } className="hover:opacity-60 invisible group-hover:visible absolute">
                        {isFetching ? <LoadingSpinner width={"w-3"} height={"h-3"}/> : <IconVerticalMenu/>}
                    </button>
                    {
                    	!isFetching && data ? 
                    	<PlaylistDropdown ref={dropdownRef} showDropdown={showDropdown} closeDropdown={() => {
                    		setShowDropdown(false)
                    	}} owned={false} containsTracks={true} playlist={{
	                    	playlistId:  data.playlistId,	
							thumbnails: [],
							title:  data.title,
							count:  data.tracks.length,
							description: "",
							tracks:  data.tracks	
                    	} as TPlaylist} />
                    	: null
                    }
                </div>
			</div>
		</>
	)
}
