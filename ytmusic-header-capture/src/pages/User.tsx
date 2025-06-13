import React, { useEffect } from "react"
import { useGetUserQuery } from "../services/private/users"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { ArtistContent, Playlist as TPlaylist, Video } from "../types/common"
import { goBack, goTo } from "react-chrome-extension-router"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { getThumbnail } from "../helpers/functions"
import { CollapseText } from "../components/elements/CollapseText"
import { ActionButton } from "../components/elements/ActionButton"
import { SideScroller } from "../components/SideScroller"
import { UserScrollContent } from "../components/UserScrollContent"
import { useLazyGetPlaylistQuery } from "../services/private/playlists"

interface Props {
	channelId: string
}

export const User = ({channelId}: Props) => {
	const {data, isFetching, isError} = useGetUserQuery(channelId ?? skipToken)

	return (
		!isFetching && data ? (
			<div className = "w-full">
				<button onClick={() => goBack()}>Go Back</button>
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
									{data.playlists?.results.map((playlist: TPlaylist) => {
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
									{data.videos?.results.map((video: Video) => {
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
