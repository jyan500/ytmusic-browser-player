import React, {useState} from "react"
import { useGetPlaylistsQuery } from "../services/private/playlists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { useAppSelector } from "../hooks/redux-hooks"
import { Playlist as TPlaylist } from "../types/common"
import { goTo, Link } from "react-chrome-extension-router"
import { Home } from "../pages/Home"
import { NavButton } from "../components/NavButton"
import { Playlist } from "../pages/Playlist"

export const Playlists = () => {
	const { headers } = useAppSelector((state) => state.auth)
	const [page, setPage] = useState(1)	
	const {data, isLoading, isError} = useGetPlaylistsQuery(headers ? {perPage: 10, page:page} : skipToken)
	return (
		<div className="container">
			<NavButton onClick={(e) => {goTo(Home)}} message={"Return Home"}/>
			<p>My Playlists</p>
			{
				data && !isLoading ? <>
					<div className = "flex flex-col gap-y-2">
					{
						data?.data.map((playlist: TPlaylist) => {
							return (
								<Link props={{playlist}} component={Playlist} className= "flex flex-row items-center border border-gray-300 shadow-md p-2">
									<p>{playlist?.title}</p>	
								</Link>
							)
						})
					}
					</div>	
					<button disabled={page == 1} onClick={() => {
						setPage(page-1)
					}}>Prev</button>
					<button disabled={page == data?.pagination.totalPages} onClick={() => {
						setPage(page+1)
					}}>Next</button>
				</> : <p>Loading Playlists...</p>
			}
		</div>
	)
}