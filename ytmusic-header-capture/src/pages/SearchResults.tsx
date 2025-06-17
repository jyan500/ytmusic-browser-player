import React, {useState, useEffect} from "react"
import { useGetSearchQuery } from "../services/private/search"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { goBack } from "react-chrome-extension-router"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { SearchContent } from "../types/common"

interface Props {
	result: string
}

interface GroupedResults {
	[key: string]: Array<SearchContent>
}

interface ResultRowProps {
	category: string
	results: GroupedResults
}

export const ResultRow = ({category, results}: ResultRowProps) => {
	return (
		<div className = "flex flex-col gap-y-2">
			<p className = "text-lg font-semibold">{category}</p>
		</div>
	)
}

export const SearchResults = ({result}: Props) => {
	const {data, isFetching, isError } = useGetSearchQuery(!result ? skipToken : {search: result}) 
	const categories = ["Top Result", "Songs", "Videos", "Albums", "Artists", "Profiles"]
	const [ groupedByCategory, setGroupedByCategory ] = useState<GroupedResults>({})
	useEffect(() => {
		if (!isFetching && data){
			const grouped: GroupedResults = data.reduce((acc: GroupedResults, obj: SearchContent) => {
				const category = obj.category
				if (category in acc){
					acc[category.toLowerCase()].push(obj)
				}
				else {
					acc[category.toLowerCase()] = [obj]
				}
				return acc
			}, {} as GroupedResults)	
			setGroupedByCategory(grouped)
		}
	}, [data, isFetching])
	return (
		<div className = "space-y-2">
			<button onClick={() => goBack()}>Go Back</button>
			{
				Object.keys(groupedByCategory).length > 0 ? (
				<div className = "flex flex-col gap-y-2">
					{
						categories.map((category: string) => {
							if (category.toLowerCase() in groupedByCategory){
								return (<ResultRow category={category} results={groupedByCategory}/>)
							}
							return <></>
						})
					}
				</div>
				) : <LoadingSpinner/>
			}
		</div>
	)
}