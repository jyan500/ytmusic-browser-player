import React, {useState} from "react"
import { useGetPlaylistsQuery } from "../services/private/playlists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { useAppSelector } from "../hooks/redux-hooks"
import { Playlist as TPlaylist } from "../types/common"
import { goTo, Link } from "react-chrome-extension-router"
import { Home } from "../pages/Home"
import { NavButton } from "../components/NavButton"
import { Playlist } from "../pages/Playlist"
import { PaginationRow } from "../components/PaginationRow"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { PlaylistGrid } from "../components/PlaylistGrid"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"

export const Playlists = () => {
	const {data, isLoading, isError} = useGetPlaylistsQuery({})
	return (
		<div className="w-full">
			<div className = "flex flex-col gap-y-2 text-lg">
				<div>
					<NavButton onClick={(e) => {goTo(Home)}} message={"Return Home"}/>
				</div>
				<p>My Playlists</p>
			</div>
			<div className = "w-full flex flex-col justify-center items-center gap-y-2">
				{
					data && !isLoading ? <>
						<InfiniteScrollList data={data} component={PlaylistGrid}/>
					</> : <LoadingSpinner/>
				}
			</div>
		</div>
	)
}

