import React, {useState} from "react"
import { Playlist as TPlaylist, PlaylistInfo, Track } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"
import { useGetPlaylistQuery } from "../services/private/playlists"
import { skipToken } from '@reduxjs/toolkit/query/react'

interface Props {
	playlist: TPlaylist
}

export const Playlist = ({playlist}: Props) => {
	const [page, setPage] = useState(1)
	const {data, isLoading, isError} = useGetPlaylistQuery(playlist.playlistId ? {playlistId: playlist.playlistId, params: {}} : skipToken)
	return (
		<div>
			<NavButton onClick={(e) => {goTo(Playlists)}} message={"Go Back"}/>
			<p>{playlist.title}</p>
		</div>
	)
}