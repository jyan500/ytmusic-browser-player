import React from "react"
import { useGetArtistQuery } from "../services/private/artists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { ArtistContent } from "../types/common"
import { goBack } from "react-chrome-extension-router"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { getThumbnail } from "../helpers/functions"
import { CollapseText } from "../components/elements/CollapseText"
import { ArtistContentTable } from "../components/ArtistContentTable"
import { ActionButton } from "../components/elements/ActionButton"
import { SideScroller } from "../components/SideScroller"
import { ArtistScrollContent } from "../components/ArtistScrollContent"

interface Props {
	browseId: string
}

export const Artist = ({browseId}: Props) => {
	const {data, isFetching, isError} = useGetArtistQuery(browseId ?? skipToken)
	return (
		!isFetching && data ? (
			<div className = "w-full">
				<button onClick={() => goBack()}>Go Back</button>
				<div className = "flex flex-col gap-y-2">
					<div className = "w-full flex flex-row gap-x-2 items-start">
						<img className = "h-48 w-48 object-cover" src={getThumbnail(data)?.url ?? ""}/>
						<div className = "flex flex-col gap-y-2">
							<p className = "text-xl font-bold">{data.name}</p>	
							<CollapseText lineClamp={"line-clamp-3"} className={"space-y-2 w-96 text-sm overflow-y-auto"} text={data.description}/>
							<div className = "flex flex-row gap-x-2">
								<p className = "text-lg">{data.subscribers}</p>								
								<p className = "text-lg">{data.views}</p>								
							</div>
						</div>
					</div>
					<div className = "space-y-2">
						<p className="text-lg font-bold">Songs</p>
						<ArtistContentTable content={data.songs.results}/>
						<ActionButton onClick={() => console.log("test")} text={"Show More"}/>
					</div>
					<div>
						<SideScroller title={"Albums"}>
							<div className = "flex flex-row gap-x-2">
								{data.albums.results.map((album: ArtistContent) => {
									return (<ArtistScrollContent content={album}/>)
								})}
							</div>
						</SideScroller>
					</div>
				</div>
			</div>
		) : <LoadingSpinner/>
	)	
}