import React, { useRef } from "react" 
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"
import { Dropdown } from "../elements/Dropdown" 
import { IconAddToPlaylist } from "../../icons/IconAddToPlaylist"
import { setIsOpen, setModalType, setModalProps } from "../../slices/modalSlice"
import { Playlist } from "../../types/common"

type Props = {
	closeDropdown: () => void
	setVideoId?: string
	videoId: string
}


export const TrackDropdown = React.forwardRef<HTMLDivElement, Props>(({
	closeDropdown, 
	setVideoId,
	videoId
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
				dispatch(setModalProps({videoId, setVideoId}))
			}
		},
	}

	return (
		<Dropdown closeDropdown={closeDropdown} ref = {ref} className = "text-white">
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
								closeDropdown()
							}}
							className="block px-4 py-2 text-sm text-white"
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

