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
	videoId: string
	displayAbove?: boolean
}


export const SearchResultsDropdown = React.forwardRef<HTMLDivElement, Props>(({
	closeDropdown, 
	videoId,
	displayAbove=false,
}: Props, ref) => {
	const dispatch = useAppDispatch()

	const options = {
		"save-to-playlist": {
			text: "Save to playlist",
			icon: <IconAddToPlaylist/>,
			onClick: () => {
				closeDropdown()
				dispatch(setModalType("add-to-playlist"))
				dispatch(setIsOpen(true))
				dispatch(setModalProps({videoId}))
			}
		},
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

