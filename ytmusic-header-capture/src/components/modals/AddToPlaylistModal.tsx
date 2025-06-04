import React, { useEffect, useState } from "react"
import { Track, Playlist } from "../../types/common"
import { 
	useAddPlaylistItemsMutation, 
	useRemovePlaylistItemsMutation, 
	useGetPlaylistsQuery 
} from "../../services/private/playlists"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { getThumbnail } from "../../helpers/functions"
import { InfiniteScrollList } from "../InfiniteScrollList"
import { SEPARATOR } from "../../helpers/constants"

export interface Props {
	videoId: string
	setVideoId?: string
}

interface PlaylistRowsProps {
	data: Array<Playlist>
}

export const PlaylistRows = ({data}: PlaylistRowsProps) => {
	return (
		<div className = "flex flex-col gap-y-3">
			{
				data.filter((playlist: Playlist) => playlist.title !== "Liked Music" && playlist.title !== "Episodes for Later").map((playlist: Playlist) => {
					return (
						<button className = "hover:bg-dark-secondary flex flex-row items-center gap-x-2">
							<div className = "h-12 w-12">
								<img className = "w-full h-full object-fill" src={getThumbnail(playlist)?.url ?? ""}/>
							</div>
							<div className = "flex flex-col items-start gap-y-1">
								<p className = "font-semibold truncate overflow-hidden">{playlist.title}</p>
								<p className = "text-gray-300 truncate overflow-hidden">{playlist.count} Songs</p>
							</div>
						</button>
					)
				})
			}
		</div>
	)
}

export const AddToPlaylistModal = ({videoId, setVideoId}: Props) => {
	const { data, isError, isFetching } = useGetPlaylistsQuery({})

	return (
		<div className = "flex flex-col gap-y-4">
			<p className = "text-xl font-semibold">Save to Playlist</p>
			{data && !isFetching ? (
				<InfiniteScrollList<Playlist> data={data} component={PlaylistRows}/>
			) : (
				<LoadingSpinner/>
			)}
		</div>
	)
}