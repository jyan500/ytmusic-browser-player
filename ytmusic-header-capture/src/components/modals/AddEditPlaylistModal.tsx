import React, { useEffect, useState } from "react"
import { Track, Playlist } from "../../types/common"
import { useAppDispatch } from "../../hooks/redux-hooks"
import { 
	useAddPlaylistItemsMutation, 
	useAddNewPlaylistMutation,
	useGetPlaylistQuery,
} from "../../services/private/playlists"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { getThumbnail } from "../../helpers/functions"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { SEPARATOR } from "../../helpers/constants"
import { addToast } from "../../slices/toastSlice"
import { v4 as uuidv4 } from "uuid"
import { IconAdd } from "../../icons/IconAdd"
import { PillButton } from "../elements/PillButton"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { PRIVACY_STATUSES } from "../../helpers/constants"
import { Input } from "../elements/Input"
import { Label } from "../elements/Label"
import { Select } from "../elements/Select"
import { setIsOpen, setModalProps, setModalType } from "../../slices/modalSlice"

export interface Props {
	videoId?: string
	playlistId?: string
}

export interface FormValues {
	title: string
	description: string
	privacyStatus: string
	videoId?: string
}

export const AddEditPlaylistModal = ({videoId, playlistId}: Props) => {
	const dispatch = useAppDispatch()
	const {data, isFetching, isError} = useGetPlaylistQuery(playlistId ? {playlistId: playlistId, params: {}} : skipToken)
	const [ form, setForm ] = useState<FormValues>({
		title: "",		
		description: "",
		privacyStatus: "PUBLIC",
		videoId: videoId ?? ""
	})

	const [errors, setErrors] = useState({
		title: {error: false, message: "Title is required"},
		privacyStatus: {error: false, message: "Privacy is required"}
	})

	const [addNewPlaylist, {isLoading: isNewPlaylistLoading, error: isNewPlaylistError}] = useAddNewPlaylistMutation()

	useEffect(() => {
		if (!isFetching && data){
			setForm({
				title: data.title,
				description: data.description,
				privacyStatus: data.privacy,
				videoId: videoId ?? ""
			})
		}
	}, [data, isFetching])

	const validatePlaylist = () => {
		setErrors((prev) => {
			return {
				...prev,
				title: {...errors.title, error: form.title === ""}
			}
		})
		setErrors((prev) => {
			return {
			...prev,
				privacyStatus: {...errors.privacyStatus, error: form.privacyStatus === ""}
			}
		})

		return form.title !== "" && form.privacyStatus !== ""
	}

	/* creates new playlist and adds the video Id to the new playlist at the same time */
	const createNewPlaylist = async () => {
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

	const editPlaylist = async () => {
		// try {
		// 	await editPlaylist({form}).unwrap()
		// 	dispatch(addToast({
		// 		id: uuidv4(),
		// 		animationType: "animation-in",
		// 		message: "Created playlist and added item successfully!"
		// 	}))
		// }
		// catch {
		// 	dispatch(addToast({
		// 		id: uuidv4(),
		// 		animationType: "animation-in",
		// 		message: "Something went wrong when adding to playlist."
		// 	}))
		// }
	}

	return (
		<div className = "flex flex-col gap-y-4">
			<p className = "text-xl font-semibold">{playlistId ? "Edit" : "New"} Playlist</p>
			<form className = "flex flex-col gap-y-4" onSubmit={async (e) => {
				e.preventDefault()
				if (validatePlaylist()){
					playlistId ? await editPlaylist() : await createNewPlaylist()
				}
				dispatch(setModalType(""))
				dispatch(setModalProps({}))
				dispatch(setIsOpen(false))
			}}>
				<div className = "flex flex-col gap-y-2">
					<Label htmlFor={"playlist-title"}>Title<span className = "font-bold">*</span></Label>	
					<Input className = "p-2 bg-dark-secondary" value={form.title} onChange={(e) => {
						setForm({
							...form,
							title: e.target.value
						})
					}} id={"playlist-title"}/>
					{errors.title.error ? <small>{errors.title.message}</small>: null}
				</div>
				<div className = "flex flex-col gap-y-2">
					<Label htmlFor={"playlist-description"}>Description</Label>	
					<Input value={form.description} onChange={(e) => {
						setForm({
							...form,	
							description: e.target.value
						})
					}} id={"playlist-description"} className = "p-2 bg-dark-secondary"/>
				</div>
				<div className = "flex flex-col gap-y-2">
					<Label htmlFor={"privacy-status"}>Privacy <span className = "font-bold">*</span></Label>	
					<Select className = "bg-dark-secondary" id={"privacy-status"} value={form.privacyStatus} onChange={(e) => {
						setForm({
							...form,
							privacyStatus: e.target.value
						})	
					}}>
						{
							PRIVACY_STATUSES.map((status: {value: string, text: string}) => {
								return (<option key={status.value} value={status.value}>{status.text}</option>)
							})
						}
					</Select>
					{errors.privacyStatus.error ? <small>{errors.privacyStatus.message}</small>: null}
				</div>
				<div>
					<PillButton type="submit" text={"Submit"}>
						{isNewPlaylistLoading ? <LoadingSpinner width={"2-3"} height={"h-3"}/> : null}
					</PillButton>
				</div>
			</form>
		</div>
	)
}
