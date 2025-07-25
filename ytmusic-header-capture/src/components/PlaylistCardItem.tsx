import React, {useState, useRef, useEffect} from "react"
import { goTo } from "react-chrome-extension-router"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { ContainsAuthor, Thumbnail, Playlist as TPlaylist } from "../types/common"
import { Playlist } from "../pages/Playlist"
import { Props as ImagePlayButtonProps, ImagePlayButton } from "./ImagePlayButton"
import { setSuggestedTracks, setIsLoading, setIsPlaying, setCurrentCardId, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setShowAudioPlayer } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetPlaylistQuery, useLazyGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { prepareQueueItems, randRange } from "../helpers/functions"
import { PlayableCard } from "./PlayableCard"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { AuthorDescription } from "./AuthorDescription"
import { LinkableDescription } from "./LinkableDescription"
import { v4 as uuidv4 } from "uuid"
import { PlaylistDropdown } from "./dropdowns/PlaylistDropdown"
import { useClickOutside } from "../hooks/useClickOutside"
import { IconVerticalMenu } from "../icons/IconVerticalMenu"
import { LoadingSpinner } from "./elements/LoadingSpinner"

interface Props {
	playlist: TPlaylist
	imageHeight?: string
	imageWidth?: string
	children?: React.ReactNode
	isHeader?: boolean
}

export const PlaylistCardItem = ({playlist, imageHeight, imageWidth, children, isHeader}: Props) => {
	// find the largest thumbnail and compress to fit 
	const dispatch = useAppDispatch()
	const [showDropdown, setShowDropdown] = useState(false)
	const { queuedTracks, isPlaying, isLoading, showAudioPlayer, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
	const widths = playlist?.thumbnails?.map((thumbnail) => thumbnail.width) ?? []
	const biggestWidth = Math.max(...widths)
	const thumbnail = playlist?.thumbnails?.find((thumbnail) => thumbnail.width === biggestWidth)
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const [ triggerGetPlaylist, {data: playlistInfoData, error: playlistError, isFetching: isPlaylistFetching} ] = useLazyGetPlaylistQuery()
	const { triggerLoadPlaylist } = useLoadPlaylist()
	const id = useRef(uuidv4())
	const dropdownRef = useRef<HTMLDivElement | null>(null)
	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const onPressPlay = () => {
		// need to get all the tracks for the playlist first when the button is clicked
		if (playlist){
			triggerGetTracks({playlistId: playlist?.playlistId, params: {}})
		}
		dispatch(setCurrentCardId(id.current))
	}

	const getLinkableDescription = () => {
		const description = playlist?.description
		const parts = description.split(" • ")
		// map the other parts to {id: null, name: <part>} so its in the OptionType format
		const remainingDescription = parts.slice(1, parts.length).map((part: string) => {
			return {
				id: null,
				name: part
			}
		})
		if ("author" in playlist && playlist.author != null){
			return (<AuthorDescription content={{
				author: [
					...playlist.author,	
					...remainingDescription,
				]
			} as ContainsAuthor}/>)
		}
		return <>{description ?? ""}</>
	}

	useEffect(() => {
		if (!isFetchingTracks && tracksData && playlist){
			triggerLoadPlaylist(playlist, tracksData, true)
		}
	}, [tracksData, isFetchingTracks])

	useClickOutside(dropdownRef, () => {
		setShowDropdown(false)
	}, buttonRef)

	return (
		isHeader ? 
			<div className = "flex flex-col gap-y-2">
				<PlayableCard 
					imageHeight={imageHeight} 
					imageWidth={imageWidth}
					title={playlist?.title ?? ""}
					description={playlist?.description ?? ""}
					thumbnail={thumbnail} 
					isHeader={isHeader}
					canPlay={false}
				>
					{children}
				</PlayableCard>
			</div>
			:
			<div className = "flex flex-col gap-y-2 relative">
				<PlayableCard 
					imageHeight={imageHeight} 
					title={playlist?.title ?? ""}
					description={playlist?.description ?? ""}
					thumbnail={thumbnail} 
					isHeader={isHeader}
					canPlay={true}
					linkableDescription={<LinkableDescription description={getLinkableDescription()}/>}
					cardOnClick={() => {
						goTo(Playlist, {playlist})
						return
					}}
					imagePlayButtonProps={{
						onPress: () => {
							// if the playlist is the currently selected playlist
							if (currentPlaylist?.playlistId === playlist?.playlistId){
								// if there are queued tracks and a current song playing, toggle the playback
								if (queuedTracks?.length && storedPlaybackInfo){
									dispatch(setIsPlaying(!isPlaying))
								}
							}
							// Otherwise, load the playlist tracks and the first song of the playlist.
							else {
								onPressPlay()
							}
						},
						id: id.current,
						imageHeight: imageHeight ?? "h-32", 
					    imageWidth: imageHeight ?? "w-32",
					    playButtonWidth: "w-6", 
					    playButtonHeight: "h-6",
					    imageURL: thumbnail?.url ?? "", 
					    showPauseButton: isPlaying && currentPlaylist?.playlistId === playlist?.playlistId,
					    dropdownContentFinishedLoading: !isPlaylistFetching,
					    showVerticalMenu: () => (
					    	<>
					    		{
					    		!isPlaylistFetching ? <>
                            	<button ref={buttonRef} onClick={() => {
                            		setShowDropdown(!showDropdown)	
                            		triggerGetPlaylist({playlistId: playlist.playlistId, params: {}}, true)
                            	}} className = "absolute top-0 right-0 mr-0.5 mt-1"><IconVerticalMenu className = {"h-6 w-6 text-gray-300"}/></button>
                            	</> : <div className = "absolute top-0 right-0 mr-1 mt-1.5"><LoadingSpinner width={"w-4"} height={"h-4"}/></div>
	                            }
						    </>
					    )
					}}
				>
					{children}
				</PlayableCard>
				{
					playlistInfoData && !isPlaylistFetching ? 
						<PlaylistDropdown showDropdown={showDropdown} ref={dropdownRef} closeDropdown={() => {setShowDropdown(false)}} playlist={playlist} owned={playlistInfoData.owned}/>	
					: null
				}
			</div>
	)
}
