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

export const Playlists = () => {
	const { headers } = useAppSelector((state) => state.auth)
	const [page, setPage] = useState(1)	
	const {data, isLoading, isError} = useGetPlaylistsQuery(headers ? {perPage: 10, page:page} : skipToken)
	return (
		<div className="w-full">
			<NavButton onClick={(e) => {goTo(Home)}} message={"Return Home"}/>
			<p>My Playlists</p>
			<div className = "w-full flex flex-col justify-center items-center gap-y-2">
				{
					data && !isLoading ? <>
						<div className = "grid grid-cols-5 gap-2">
						{
							data?.data.map((playlist: TPlaylist) => {
								// find the largest thumbnail and compress to fit 
								const widths = playlist.thumbnails?.map((thumbnail) => thumbnail.width) ?? []
								const biggestWidth = Math.max(...widths)
								const thumbnail = playlist.thumbnails?.find((thumbnail) => thumbnail.width === biggestWidth)
								return (
									<Link props={playlist} component={Playlist}>
										<div className="flex flex-col gap-y-2">
											<img className="w-30 h-30 object-cover" src = {thumbnail?.url}/>
											<p className = "break-words">{playlist?.title}</p>
										</div>
									</Link>
								)
							})
						}
						</div>	
						<PaginationRow page={page} setPage={setPage} totalPages={data.pagination.totalPages ?? 0}/>
					</> : <p>Loading Playlists...</p>
				}
			</div>
		</div>
	)
}