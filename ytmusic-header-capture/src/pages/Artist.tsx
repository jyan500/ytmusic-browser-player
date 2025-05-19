import React from "react"
import { useGetArtistQuery } from "../services/private/artists"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { goBack } from "react-chrome-extension-router"

interface Props {
	browseId: string
}

export const Artist = ({browseId}: Props) => {
	const {data, isFetching, isError} = useGetArtistQuery(browseId ?? skipToken)
	return (
		<div className = "flex flex-col gap-y-2">
			<button onClick={() => goBack()}>Go Back</button>
		</div>
	)	
}