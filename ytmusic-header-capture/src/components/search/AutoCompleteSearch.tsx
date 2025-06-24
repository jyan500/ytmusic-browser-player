import React, { useState, useEffect } from "react"
import { SearchBar } from "./SearchBar"
import { SearchResults } from "./SearchResults"
import { useDebouncedValue } from "../../hooks/useDebouncedValue" 
import { useLazyGetSearchSuggestionsQuery } from "../../services/private/search"
import { SearchSuggestionContent } from "../../types/common"
import { SearchResults as SearchResultsPage } from "../../pages/SearchResults"
import { goTo } from "react-chrome-extension-router"

export const AutoCompleteSearch = () => {
	const [trigger, {data, isFetching, isError}] = useLazyGetSearchSuggestionsQuery()
	const [searchTerm, setSearchTerm] = useState<string>("")
	const [ suggestedResults, setSuggestedResults ] = useState<Array<SearchSuggestionContent>>([])

	const debouncedSearch = useDebouncedValue(searchTerm, 400)

	useEffect(() => {
		if (data && !isFetching){
			setSuggestedResults(data)	
		}
	}, [data, isFetching])

	useEffect(() => {
		if (debouncedSearch !== ""){
			trigger({search: debouncedSearch})
		}
	}, [debouncedSearch])

	const onChange = (param: string) => {
		setSearchTerm(param)
	}

	const onClickResult = (result: string) => {
		goTo(SearchResultsPage, {result})
		return
	}

	return (
		<div className = "relative">
			<form onSubmit={(e) => {
				e.preventDefault()
				onClickResult(searchTerm)
			}}>
				<SearchBar onChange={onChange} placeholder={"Search songs, albums, artists"}/>
				{
					isFetching || suggestedResults.length > 0 ? 
					<SearchResults onClickResult={onClickResult} data={suggestedResults} isLoading={isFetching}/>
					: null
				}
			</form>
		</div>
	)	
}