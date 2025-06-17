import React from "react"
import { useGetSearchQuery } from "../services/private/search"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { goBack } from "react-chrome-extension-router"

interface Props {
	result: string
}

export const SearchResults = ({result}: Props) => {
	const {data, isFetching, isError } = useGetSearchQuery(!result ? skipToken : {search: result}) 
	return (
		<div className = "flex flex-col gap-y-2">
			<button onClick={() => goBack()}>Go Back</button>
			<div>
				<p>Top Result</p>
			</div>
			<div>
				<p>Songs</p>	
			</div>
		</div>
	)
}