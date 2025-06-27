import React, {useState, useEffect} from "react"
import { useGetSearchQuery } from "../services/private/search"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { goBack, goTo } from "react-chrome-extension-router"
import { Artist } from "./Artist"
import { User } from "./User"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { Playlist as TPlaylist, ContainsArtists, ContainsAuthor, SearchContent } from "../types/common"
import { SearchResultsRow } from "../components/search/SearchResultsRow"
import { TopResultRow } from "../components/search/TopResultRow"
import { getThumbnail } from "../helpers/functions"
import { ArtistDescription } from "../components/ArtistDescription"
import { AuthorDescription } from "../components/AuthorDescription"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { useLazyGetPlaylistTracksQuery, useLazyGetWatchPlaylistQuery } from "../services/private/playlists"
import { AutoCompleteSearch } from "../components/search/AutoCompleteSearch"

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

const ResultRow = ({category, results}: ResultRowProps) => {
    
	const displayContent = () => {
		if (category === "Top Result"){
			const data: Array<SearchContent> = results["top result"]
			if (data.length && data[0].resultType !== "episode" && data[0].resultType !== "podcast"){
				return (
					<>
						<p className = "text-lg font-semibold">{category}</p>
						<TopResultRow resultType={data[0].resultType} data={data[0]}/>
					</>
				)
			}
			return <></>
		}
		return <>
			<p className = "text-lg font-semibold">{category}</p>
			<ul className = "flex flex-col gap-y-1">
			{
				results[category.toLowerCase()]?.map((data: SearchContent, index: number) => (
					<SearchResultsRow 
						data={data} 
						canPlay={"videoId" in data || "playlistId" in data || data.resultType === "playlist" || data.resultType === "album"}
						thumbnail={getThumbnail(data)?.url ?? ""}
						key={`search-content-${data.resultType}-${index}`}
					/>
				))
			}
			</ul>
		</>
	}

	return (
		<div className = "flex flex-col gap-y-2">
			{displayContent()}
		</div>
	)
}

export const SearchResults = ({result}: Props) => {
	const {data, isFetching, isError } = useGetSearchQuery(!result ? skipToken : {search: result}) 
	const categories = ["Top Result", "Episodes", "Songs", "Videos", "Albums", "Artists", "Community Playlists", "Profiles"]
	const [ groupedByCategory, setGroupedByCategory ] = useState<GroupedResults>({})
	useEffect(() => {
		if (!isFetching && data){
			const grouped: GroupedResults = data.reduce((acc: GroupedResults, obj: SearchContent) => {
				const category = obj.category?.toLowerCase() ?? ""
				if (category !== ""){
					if (category in acc){
						acc[category].push(obj)
					}
					else {
						acc[category] = [obj]
					}
				}
				return acc
			}, {} as GroupedResults)	
			setGroupedByCategory(grouped)
		}
	}, [data, isFetching])
	return (
		<div className = "space-y-2">
			<button onClick={() => goBack()}>Go Back</button>
			<AutoCompleteSearch existingSearchTerm={result}/>
			{
				!isFetching && Object.keys(groupedByCategory).length > 0 ? (
				<div className = "flex flex-col gap-y-4">
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
