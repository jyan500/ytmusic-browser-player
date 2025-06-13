import React, { useEffect } from "react"
import { useGetArtistQuery } from "../services/private/artists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { ArtistContent, Playlist as TPlaylist } from "../types/common"
import { goBack, goTo } from "react-chrome-extension-router"
import { Playlist } from "../pages/Playlist"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { getThumbnail } from "../helpers/functions"
import { CollapseText } from "../components/elements/CollapseText"
import { ArtistContentTable } from "../components/ArtistContentTable"
import { ActionButton } from "../components/elements/ActionButton"
import { SideScroller } from "../components/SideScroller"
import { ArtistScrollContent } from "../components/ArtistScrollContent"
import { useLazyGetPlaylistQuery } from "../services/private/playlists"
import { User } from "../pages/User"

interface Props {
	browseId: string
}

export const Artist = ({browseId}: Props) => {
	const {data, isFetching, isError} = useGetArtistQuery(browseId ?? skipToken)
	const [ triggerGetPlaylist, { data: playlist, isError: isPlaylistError, isFetching: isPlaylistFetching}] = useLazyGetPlaylistQuery()

	useEffect(() => {
		if (!isFetching && isError){
			goTo(User, {channelId: browseId, invalidArtist: true})
		}
	}, [isFetching, isError])

	useEffect(() => {
		if (!isPlaylistFetching && playlist && data){
			goTo(Playlist, {playlist: {
				playlistId: playlist.id,
				count: playlist.trackCount,
				thumbnails: [getThumbnail(data)],
				description: playlist.description,
				title: "All Songs",
			} as TPlaylist})
		}
	}, [ playlist, isPlaylistFetching ])

	return (
		!isFetching && data ? (
			<div className = "w-full">
				<button onClick={() => goBack()}>Go Back</button>
				<div className = "flex flex-col gap-y-2">
					<div className = "w-full flex flex-row gap-x-4 items-start">
						<img className = "rounded-full h-48 w-48 object-cover" src={getThumbnail(data)?.url ?? ""}/>
						<div className = "flex flex-col gap-y-2">
							<p className = "text-xl font-bold">{data.name}</p>	
							{
								data.description ? 
								<CollapseText lineClamp={"line-clamp-3"} className={"space-y-2 w-96 text-sm overflow-y-auto"} text={data.description}/>
								: null
							}
							<div className = "flex flex-row gap-x-2">
								<p className = "text-lg text-orange">{data.subscribers} subscribers</p>								
								<p className = "text-lg">{data.views}</p>								
							</div> 
						</div>
					</div>
					{
						data.songs?.results ? 
						<div className = "space-y-2">
							<p className="text-lg font-bold">Songs</p>
							<ArtistContentTable content={data.songs?.results}/>
							<ActionButton isLoading={isPlaylistFetching} onClick={() => {
								triggerGetPlaylist({playlistId: data.songs?.browseId, params: {}}, true)
							}} text={"Show More"}/>
						</div>
						: null
					}
					<div>
						{
							data?.albums ? 
							<SideScroller height={"h-48"} title={"Albums"}>
								<div className = "flex flex-row gap-x-2">
									{data.albums?.results.map((album: ArtistContent) => {
										return <ArtistScrollContent content={album}/>
									})}
								</div>
							</SideScroller> : 
							null
						}
					</div>
					<div>
						{
							data.singles?.results ? 
							<SideScroller height={"h-48"} title={"Singles & EPs"}>	
								<div className = "flex flex-row gap-x-2">
									{data.singles?.results.map((single: ArtistContent) => {
										return <ArtistScrollContent content={single}/>
									})}
								</div>
							</SideScroller> : null
						}
					</div>
					<div>
						{
							data.related?.results ? 
							<SideScroller height={"h-48"} title="Related Artists">
								<div className = "flex flex-row gap-x-2">
									{data.related?.results.map((relatedArtist: ArtistContent) => {
										return <ArtistScrollContent content={relatedArtist}/>
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
