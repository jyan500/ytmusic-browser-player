import React, { useRef } from "react" 
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"
import { Dropdown } from "../elements/Dropdown" 
import { IconAddToPlaylist } from "../../icons/IconAddToPlaylist"
import { IconTrash } from "../../icons/IconTrash"
import { setIsOpen, setModalType, setModalProps } from "../../slices/modalSlice"
import { Playlist, VideoItem } from "../../types/common"
import { useLazyGetPlaylistQuery } from "../../services/private/playlists"
import { v4 as uuidv4 } from "uuid"
import { addToast } from "../../slices/toastSlice"
import { LoadingSpinner } from "../elements/LoadingSpinner"

type Props = {
	closeDropdown: () => void
	owned?: boolean
	playlistId?: string
	displayAbove?: boolean
}


export const PlaylistDropdown = React.forwardRef<HTMLDivElement, Props>(({
	closeDropdown, 
	playlistId, 
	owned,
	displayAbove=false,
}: Props, ref) => {
	const dispatch = useAppDispatch()

	const options = {

		...(owned ? {"delete-playlist": {
			text: "Delete playlist",
			icon: <IconTrash/>,
			onClick: () => {
				closeDropdown()
				dispatch(setModalType("delete-playlist"))
				dispatch(setIsOpen(true))
				dispatch(setModalProps({playlistId}))
			}
		}} : {}),
	}

	return (
		<Dropdown closeDropdown={closeDropdown} ref = {ref} className = {`${displayAbove ? "bottom-full right-full mb-2": "mt-2"} text-white`}>
			<ul>
				{Object.values(options).map((option) => {
					return (
						<li
							key={option.text}
							onClick={(e) => {
								option.onClick()
							}}
							className={`hover:opacity-60 cursor-pointer block px-4 py-2 text-sm text-white`}
							role="menuitem"
						>
							<div className = "flex flex-row gap-x-2 items-center">
								<div>{option.icon}</div>
								<p>{option.text}</p>
							</div>
						</li>
					)
				})}			
			</ul>
		</Dropdown>
	)	
})

