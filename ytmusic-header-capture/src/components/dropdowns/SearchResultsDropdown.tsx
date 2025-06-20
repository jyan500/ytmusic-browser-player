import React, { useRef } from "react" 
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"
import { Dropdown } from "../elements/Dropdown" 
import { IconAddToPlaylist } from "../../icons/IconAddToPlaylist"
import { setIsOpen, setModalType, setModalProps } from "../../slices/modalSlice"
import { Playlist, VideoItem } from "../../types/common"
import { IconTrash } from "../../icons/IconTrash"
import { useLazyGetPlaylistQuery, useRemovePlaylistItemsMutation } from "../../services/private/playlists"
import { v4 as uuidv4 } from "uuid"
import { addToast } from "../../slices/toastSlice"
import { LoadingSpinner } from "../elements/LoadingSpinner"

type Props = {
	closeDropdown: () => void
	displayAbove?: boolean
}


export const SearchResultsDropdown = React.forwardRef<HTMLDivElement, Props>(({
	closeDropdown, 
	displayAbove=false,
}: Props, ref) => {
	const dispatch = useAppDispatch()
	// const [removePlaylistItems, {isLoading, error}] = useRemovePlaylistItemsMutation()
	// const [triggerGetPlaylist, {data, isFetching, isError}] = useLazyGetPlaylistQuery()

	// const removePlaylistItem = async () => {
	// 	if (playlistId && videoId && setVideoId){
	// 		const id = uuidv4()
	// 		try {
	// 			await removePlaylistItems({playlistId, videoItems: [{videoId, setVideoId} as VideoItem]}).unwrap()
	// 			await triggerGetPlaylist({playlistId: playlistId, params: {}}).unwrap()
	// 			dispatch(addToast({
	// 				id: id,
	// 				message: "Removed successfully!",
	// 				animationType: "animation-in"
	// 			}))
	// 		}
	// 		catch (e) {
	// 			dispatch(addToast({
	// 				id: id,
	// 				message: "Something went wrong when removing from playlist",
	// 				animationType: "animation-in"
	// 			}))
	// 		}
	// 		finally {
	// 			closeDropdown()
	// 		}
	// 	}
	// }

	const options = {
		"test": {
			text: "Test",
			icon: <IconAddToPlaylist/>,
			onClick: () => {
				console.log("test")
			}
		}
		// "save-to-playlist": {
		// 	text: "Save to playlist",
		// 	icon: <IconAddToPlaylist/>,
		// 	onClick: () => {
		// 		closeDropdown()
		// 		dispatch(setModalType("add-to-playlist"))
		// 		dispatch(setIsOpen(true))
		// 		dispatch(setModalProps({videoId, setVideoId}))
		// 	}
		// },
		// ...(playlistId && setVideoId ? {"remove-from-playlist": {
		// 	text: "Remove from playlist",	
		// 	icon: <IconTrash/>,
		// 	onClick: removePlaylistItem
		// }}: {})
	}

	return (
		<Dropdown closeDropdown={closeDropdown} ref = {ref} className = {`${displayAbove ? "bottom-full right-full mb-2": "mt-2"} text-white`}>
			<ul>
				{Object.values(options).map((option) => {
					return (
						<li
							key={option.text}
							onClick={(e) => {
								if (e.defaultPrevented){
									return 
								}
								option.onClick()
							}}
							className={`hover:opacity-60 cursor-pointer block px-4 py-2 text-sm text-white`}
							role="menuitem"
						>
							<div className = "flex flex-row gap-x-2 items-center">
								{<div>{option.icon}</div>}
								<p>{option.text}</p>
							</div>
						</li>
					)
				})}			
			</ul>
		</Dropdown>
	)	
})

