import React, { useEffect, useState } from "react"
import { Track, Playlist } from "../../types/common"
import { useAppDispatch } from "../../hooks/redux-hooks"
import { 
	useAddPlaylistItemsMutation, 
	useAddNewPlaylistMutation,
} from "../../services/private/playlists"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { getThumbnail } from "../../helpers/functions"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { SEPARATOR } from "../../helpers/constants"
import { addToast } from "../../slices/toastSlice"
import { v4 as uuidv4 } from "uuid"
import { IconAdd } from "../../icons/IconAdd"
import { PillButton } from "../elements/PillButton"

export interface Props {
	videoId: string
}

export interface FormValues {
	title: string
	description: string
	privacyStatus: string
	videoId?: string
}

export const NewPlaylistModal = ({videoId}: Props) => {
	const dispatch = useAppDispatch()
	const [addNewPlaylist, {isLoading, error}] = useAddNewPlaylistMutation()

	/* creates new playlist and adds the video Id to the new playlist at the same time */
	const createNewPlaylist = async (form: FormValues) => {
		try {
			await addNewPlaylist({form}).unwrap()
			dispatch(addToast({
				id: uuidv4(),
				animationType: "animation-in",
				message: "Created playlist and added item successfully!"
			}))
		}
		catch {
			dispatch(addToast({
				id: uuidv4(),
				animationType: "animation-in",
				message: "Something went wrong when adding to playlist."
			}))
		}
	}

	return (
		<div className = "flex flex-col gap-y-4">
			<p className = "text-xl font-semibold">New Playlist</p>
		</div>
	)
}
