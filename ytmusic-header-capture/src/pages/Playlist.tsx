import React, {useState, useEffect, useRef} from "react"
import { Playlist as TPlaylist, PlaylistInfo, Track } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"
import { useGetPlaylistTracksQuery } from "../services/private/playlists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { PaginationRow } from "../components/PaginationRow"

interface Props {
	playlist: TPlaylist
}

export const Playlist = ({playlist}: Props) => {
	const [page, setPage] = useState(1)
	const {data: tracks, isLoading: isTracksLoading, isError: isTracksError} = useGetPlaylistTracksQuery(playlist ? {playlistId: playlist.playlistId, params: {page: page, perPage: 10}} : skipToken)
	const divRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		})	
	}, [playlist])

	return (
		<div>
			<NavButton onClick={(e) => {goTo(Playlists)}} message={"Go Back"}/>
			<p>{playlist.title}</p>
			<p>Playlist Tracks</p>
			<div>
				{
					isTracksLoading && !tracks ? <p>Tracks loading... </p> : (
						<>
							{tracks?.map((track: Track) => {
								return (
									<div className = "border-1 border-gray-300 flex flex-col gap-y-2 shadow-md">
										<p>{track.title}</p>							
									</div>
								)
							})}
							{/*<PaginationRow page={page} setPage={setPage} totalPages={tracks?.pagination.totalPages ?? 0}/>*/}
						</>
					)
				}
			</div>

		</div>
	)
}
