import React, { useEffect, useRef } from "react" 
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"
import { Dropdown } from "../elements/Dropdown" 
import { IconAddToPlaylist } from "../../icons/IconAddToPlaylist"
import { IconTrash } from "../../icons/IconTrash"
import { setIsOpen, setModalType, setModalProps } from "../../slices/modalSlice"
import { Playlist as TPlaylist, VideoItem } from "../../types/common"
import { useLazyGetPlaylistQuery } from "../../services/private/playlists"
import { v4 as uuidv4 } from "uuid"
import { addToast } from "../../slices/toastSlice"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { IconAddToQueue } from "../../icons/IconAddToQueue"
import { setShowQueuedTrackList, setPlaylist } from "../../slices/queuedTrackListSlice"
import { setQueuedTracks, setIsLoading } from "../../slices/audioPlayerSlice"
import { useQueuePlaylist } from "../../hooks/useQueuePlaylist"
import { useLazyGetPlaylistTracksQuery } from "../../services/private/playlists"
import { usePrevious } from "../../hooks/usePrevious"
import { PLAYLIST_DROPDOWN_Z_INDEX } from "../../helpers/constants"
import { IconEdit } from "../../icons/IconEdit"

type Props = {
	closeDropdown: () => void
	showDropdown: boolean
	owned?: boolean
	playlist: TPlaylist,
	displayAbove?: boolean
}


export const PlaylistDropdown = React.forwardRef<HTMLDivElement, Props>(({
	closeDropdown, 
	playlist,
	showDropdown,
	owned,
	displayAbove=false,
}: Props, ref) => {
	const dispatch = useAppDispatch()
	const { isLoading, queuedTracks } = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList } = useAppSelector((state) => state.queuedTrackList)
	const { triggerQueuePlaylist } = useQueuePlaylist()
	const [ triggerGetTracks, {data: tracksData, isFetching: isTracksFetching, isError: isTracksError } ] = useLazyGetPlaylistTracksQuery()
	const prevLoading = usePrevious(isLoading)

	const addToQueue = () => {
		triggerGetTracks({playlistId: playlist.playlistId ?? "", params: {}})
	}

	useEffect(() => {
		if (!isLoading && prevLoading){
			closeDropdown()
		}
	}, [isLoading, prevLoading])

	useEffect(() => {
		if (!isTracksFetching && tracksData){
			// include the playlistId as audioPlaylistId for album playlists
			// if there are no existing queue items, load the queue, and set the playback for the top
			// of the queue.
			// Otherwise, only load the items into the queue.
			triggerQueuePlaylist({
				...playlist,
				playlistId: "audioPlaylistId" in playlist ? playlist.audioPlaylistId : playlist.playlistId,
			} as TPlaylist, tracksData)
			dispatch(addToast({
				id: uuidv4(),
				message: "Playlist added to queue",
				animationType: "animation-in"
			}))
		}
	}, [tracksData, isTracksFetching])

	const options = {
		"add-to-queue": {
			text: "Add to Queue",
			icon: <IconAddToQueue/>,
			onClick: () => {
				dispatch(setIsLoading(true))
				addToQueue()
			}
		},
		...(owned ? {"edit-playlist": {
			text: "Edit Playlist",
			icon: <IconEdit/>,
			onClick: () => {
				closeDropdown()
				dispatch(setModalType("add-edit-playlist"))
				dispatch(setIsOpen(true))
				dispatch(setModalProps({playlistId: playlist.playlistId}))
			},
		}} : {}),
		...(owned ? {"delete-playlist": {
			text: "Delete playlist",
			icon: <IconTrash/>,
			onClick: () => {
				closeDropdown()
				dispatch(setModalType("delete-playlist"))
				dispatch(setIsOpen(true))
				dispatch(setModalProps({playlistId: playlist.playlistId}))
			}
		}} : {}),

	}

	return (
		// we want a z index that's less than the queued tracklist 
		<Dropdown showDropdown={showDropdown} zIndex={PLAYLIST_DROPDOWN_Z_INDEX} closeDropdown={closeDropdown} ref = {ref} className = {`${displayAbove ? "bottom-full right-full mb-2": "mt-2"} text-white`}>
			<ul>
				{Object.values(options).map((option) => {
					return (
						<li
							key={option.text}
							onClick={(e) => {
								if (e.defaultPrevented || isLoading){
									return 
								}
								option.onClick()
							}}
							className={`hover:opacity-60 cursor-pointer block px-4 py-2 text-sm text-white`}
							role="menuitem"
						>
							<div className = "flex flex-row gap-x-2 items-center">
								{isLoading && option.text === "Add to Queue" ? <div><LoadingSpinner width={"w-3"} height={"h-3"}/></div> : <div>{option.icon}</div>}
								<p>{option.text}</p>
							</div>
						</li>
					)
				})}			
			</ul>
		</Dropdown>
	)	
})

