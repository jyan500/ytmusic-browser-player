import React, { useEffect } from "react"
import { useGetUserQuery } from "../services/private/users"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { UserContent, Playlist as TPlaylist, Video } from "../types/common"
import { goBack, goTo } from "react-chrome-extension-router"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { getThumbnail } from "../helpers/functions"
import { CollapseText } from "../components/elements/CollapseText"
import { ActionButton } from "../components/elements/ActionButton"
import { SideScroller } from "../components/SideScroller"
import { UserScrollContent } from "../components/UserScrollContent"
import { addToast } from "../slices/toastSlice"
import { v4 as uuidv4 } from "uuid"
import { useAppDispatch } from "../hooks/redux-hooks"
import { Home } from "./Home"

interface Props {
	channelId: string
	invalidArtist?: boolean
}

export const User = ({channelId, invalidArtist}: Props) => {
	const {data, isFetching, isError} = useGetUserQuery(channelId ?? skipToken)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (isError){
			dispatch(addToast({
				id: uuidv4(),	
				message: "Page could not be found!",
				animationType: "animation-in"
			}))
			goTo(Home)
			return
		}
	}, [isError])

	return (
		!isFetching && data ? (
			<div className = "w-full">
				{/* To prevent a loop where the user clicks on an artist, and it redirects to a user page (due to invalid artist id), 
				go back home instead. */}
				<button onClick={() => invalidArtist ? goTo(Home) : goBack()}>Go Back</button>
				<div className = "flex flex-col gap-y-2">
					<div className = "w-full flex flex-row gap-x-4 items-start">
						<div className = "flex flex-col gap-y-2">
							<p className = "text-xl font-bold">{data.name}</p>	
						</div>
					</div>
					<div>
						{
							data.playlists?.results ? 
							<SideScroller height={"h-48"} title={"Playlists"}>	
								<div className = "flex flex-row gap-x-2">
									{data.playlists?.results.map((playlist: UserContent) => {
										return <UserScrollContent content={playlist}/>
									})}
								</div>
							</SideScroller> : null
						}
					</div>
					<div>
						{
							data.videos?.results ? 
							<SideScroller height={"h-48"} title="Videos">
								<div className = "flex flex-row gap-x-2">
									{data.videos?.results.map((video: UserContent) => {
										return <UserScrollContent content={video}/>
									})}
								</div>
							</SideScroller>
							: null
						}
					</div>
				</div>
			</div>
		) : <LoadingSpinner/>
	)	
}
