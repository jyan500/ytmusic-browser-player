import React from "react"
import { useGetArtistQuery } from "../services/private/artists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { goBack } from "react-chrome-extension-router"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { getThumbnail } from "../helpers/functions"
import { CollapseText } from "../components/elements/CollapseText"

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
							<p className = "text-xl font-semibold">{data.name}</p>	
							<CollapseText lineClamp={"line-clamp-3"} className={"w-96 text-sm overflow-y-auto"} text={data.description}/>
						</div>
					</div>
				</div>
			</div>
		) : <LoadingSpinner/>
	)	
}