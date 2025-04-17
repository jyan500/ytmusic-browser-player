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
			<div className = "flex flex-col gap-y-2 text-lg">
				<div>
					<NavButton onClick={(e) => {goTo(Home)}} message={"Return Home"}/>
				</div>
				<p>My Playlists</p>
			</div>
			<div className = "w-full flex flex-col justify-center items-center gap-y-2">
				{
					data && !isLoading ? <>
						<div className = "grid grid-cols-5 gap-2">
						{
							data.map((playlist: TPlaylist) => {
								// find the largest thumbnail and compress to fit 
								const widths = playlist.thumbnails?.map((thumbnail) => thumbnail.width) ?? []
								const biggestWidth = Math.max(...widths)
								const thumbnail = playlist.thumbnails?.find((thumbnail) => thumbnail.width === biggestWidth)
								return (
									<button className = "flex flex-col" onClick={() => goTo(Playlist, {playlist})}>
										<div className="items-start flex flex-col gap-y-2">
											<img className="h-32 object-fill" src = {thumbnail?.url}/>
											<div className = "text-left break-words">
												<p className = "font-semibold">{playlist?.title}</p>
												<p>{playlist?.description}</p>
											</div>
										</div>
									</button>
								)
							})
						}
						</div>	
						{/*<PaginationRow page={page} setPage={setPage} totalPages={data.pagination.totalPages ?? 0}/>*/}
					</> : <p>Loading Playlists...</p>
				}
			</div>
		</div>
	)
}
