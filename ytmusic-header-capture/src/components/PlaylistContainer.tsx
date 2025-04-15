import React from "react"
import { useGetPlaylistsQuery } from "../services/private/playlists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { useAppSelector } from "../hooks/redux-hooks"

export const PlaylistContainer = () => {
	const { headers } = useAppSelector((state) => state.auth)
	const {data, isLoading, isError} = useGetPlaylistsQuery(headers ? {} : skipToken)
	return (
		<div>Playlists displayed here</div>
	)
}