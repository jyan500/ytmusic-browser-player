import React, { useEffect, useState } from "react"
import { Track, Playlist } from "../../types/common"
import { useAppDispatch } from "../../hooks/redux-hooks"
import { 
	useAddPlaylistItemsMutation, 
	useRemovePlaylistItemsMutation, 
	useGetPlaylistsQuery,
} from "../../services/private/playlists"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { getThumbnail } from "../../helpers/functions"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { SEPARATOR } from "../../helpers/constants"
import { addToast } from "../../slices/toastSlice"
import { v4 as uuidv4 } from "uuid"

export interface Props {
	videoId: string
	setVideoId?: string
}

interface PlaylistRowsProps {
	data: Array<Playlist>
	addToPlaylist: (playlistId: string) => void
	loading: PlaylistRowLoading
}

interface PlaylistRowLoading {
	playlistId: string | undefined
	loading: boolean
}

export const PlaylistRows = ({data, addToPlaylist, loading}: PlaylistRowsProps) => {
	return (
		<div className = "flex flex-col gap-y-3">
			{
				data.filter((playlist: Playlist) => playlist.title !== "Liked Music" && playlist.title !== "Episodes for Later").map((playlist: Playlist) => {
					return (
						/* prevent clicking another playlist while an item is being added and is still loading */
						<button disabled={loading.loading} onClick={() => addToPlaylist(playlist.playlistId)} className = {`${loading.loading ? "opacity-60" : ""} hover:bg-dark-secondary flex flex-row items-center justify-between`}>
							<div className = "flex flex-row items-center gap-x-2">
								<div className = "h-12 w-12">
									<img className = "w-full h-full object-fill" src={getThumbnail(playlist)?.url ?? ""}/>
								</div>
								<div className = "flex flex-col items-start gap-y-1">
									<p className = "font-semibold truncate overflow-hidden">{playlist.title}</p>
									<p className = "text-gray-300 truncate overflow-hidden">{playlist.count} Songs</p>
								</div>
							</div>
							{
								loading.loading && loading.playlistId === playlist.playlistId ? <div className = "mr-2"><LoadingSpinner width={"w-4"} height={"h-4"}/></div> : null
							}
						</button>
					)
				})
			}
		</div>
	)
}

export const AddToPlaylistModal = ({videoId, setVideoId}: Props) => {
	const { data, isError, isFetching } = useGetPlaylistsQuery({})
	const dispatch = useAppDispatch()
	const [addPlaylistItems, {isLoading, error}] = useAddPlaylistItemsMutation()
	const [loading, setLoading] = useState<PlaylistRowLoading>({loading: false, playlistId: undefined})

	useEffect(() => {
		if (data && !isFetching && loading.loading){
			setLoading({loading: false, playlistId: undefined})
			dispatch(addToast({
				id: uuidv4(),
				animationType: "animation-in",
				message: "Added to playlist!"
			}))
		}
	}, [data, isFetching])

	const addToPlaylist = async (playlistId: string) => {
		setLoading({loading: true, playlistId: playlistId})
		try {
			await addPlaylistItems({playlistId, videoIds: [videoId]}).unwrap()
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
			<p className = "text-xl font-semibold">Save to Playlist</p>
			{data ? (
				<InfiniteScrollList<Playlist, Omit<PlaylistRowsProps, "data">> props={{addToPlaylist: addToPlaylist, loading}} data={data} component={PlaylistRows}/>
			) : (
				<LoadingSpinner/>
			)}
		</div>
	)
}