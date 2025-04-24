import React, {useState, useEffect, useRef} from "react"
import { Playlist as TPlaylist, PlaylistInfo, Track } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"
import { useGetPlaylistTracksQuery } from "../services/private/playlists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { PaginationRow } from "../components/PaginationRow"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { TrackList } from "../components/TrackList"

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
						<InfiniteScrollList<Track> data={tracks ?? []} component={TrackList}/>
					)
				}
			</div>

		</div>
	)
}
