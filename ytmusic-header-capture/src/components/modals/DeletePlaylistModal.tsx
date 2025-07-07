import React, { useEffect, useState } from "react"
import { Track, Playlist } from "../../types/common"
import { useAppDispatch } from "../../hooks/redux-hooks"
import { 
	useLazyGetPlaylistsQuery,
	useDeletePlaylistMutation
} from "../../services/private/playlists"
import {
	useLazyGetHomeQuery,
} from "../../services/private/home"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { getThumbnail } from "../../helpers/functions"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { SEPARATOR } from "../../helpers/constants"
import { v4 as uuidv4 } from "uuid"
import { goTo } from "react-chrome-extension-router"
import { IconAdd } from "../../icons/IconAdd"
import { PillButton } from "../elements/PillButton"
import { addToast } from "../../slices/toastSlice"
import { setIsOpen, setModalType, setModalProps } from "../../slices/modalSlice"
import { Playlists } from "../../pages/Playlists"

export interface Props {
	playlistId: string
}

export const DeletePlaylistModal = ({playlistId}: Props) => {
	const dispatch = useAppDispatch()
	const [deletePlaylist, {isLoading, error}] = useDeletePlaylistMutation()
	const [triggerGetPlaylists, {data, isFetching, isError}] = useLazyGetPlaylistsQuery()

	const onConfirm = async () => {
		try {
			await deletePlaylist({playlistId: playlistId}).unwrap()
			await triggerGetPlaylists({}).unwrap()
			goTo(Playlists, {})
			dispatch(addToast({
				id: uuidv4(),
				message: "Playlist deleted successfully!",
				animationType: "animation-in"
			}))
		}
		catch (e){
			dispatch(addToast({
				id: uuidv4(),
				message: "Something went wrong when deleting playlist",
				animationType: "animation-in"
			}))
		}
		finally {
			onClose()
		}
	}

	const onClose = () => {
		dispatch(setIsOpen(false))
		dispatch(setModalType(""))
		dispatch(setModalProps({}))
	}

	return (
		<div className = "flex flex-col gap-y-4">
			<p className = "text-xl font-semibold">Delete Playlist</p>
			<p>Are you sure you want to delete this playlist?</p>
			<div className = "flex flex-row gap-x-2">
				<PillButton disabled={isFetching || isLoading} onClick={() => onConfirm()} text={"Confirm"}>{isFetching || isLoading ? <LoadingSpinner width={"w-3"} height={"h-3"}/> : null}</PillButton>
				<PillButton disabled={isFetching || isLoading} onClick={() => onClose()} className="!bg-dark-secondary !text-white" text={"Cancel"}></PillButton>
			</div>
		</div>
	)
}
