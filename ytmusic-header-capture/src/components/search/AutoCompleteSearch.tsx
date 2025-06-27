import React, { useState, useEffect, useRef } from "react"
import { SearchBar } from "./SearchBar"
import { SearchResults } from "./SearchResults"
import { useAppDispatch } from "../../hooks/redux-hooks"
import { useDebouncedValue } from "../../hooks/useDebouncedValue" 
import { useRemoveSearchSuggestionsMutation, useLazyGetSearchSuggestionsQuery } from "../../services/private/search"
import { SearchSuggestionContent } from "../../types/common"
import { SearchResults as SearchResultsPage } from "../../pages/SearchResults"
import { goTo, getCurrent } from "react-chrome-extension-router"
import { addToast } from "../../slices/toastSlice"
import { v4 as uuidv4 } from "uuid"
import { useClickOutside } from "../../hooks/useClickOutside"
import { usePrevious } from "../../hooks/usePrevious"

interface Props {
	existingSearchTerm?: string
}

export const AutoCompleteSearch = ({existingSearchTerm = ""}: Props) => {
	const dispatch = useAppDispatch()
	const searchSuggestionsRef = useRef<HTMLDivElement>(null)
	const searchBarRef = useRef<HTMLDivElement>(null)
	const [trigger, {data, isFetching, isError}] = useLazyGetSearchSuggestionsQuery()
	const [searchTerm, setSearchTerm] = useState<string>(existingSearchTerm)
	const [ suggestedResults, setSuggestedResults ] = useState<Array<SearchSuggestionContent>>([])
	const [ openSuggestedResults, setOpenSuggestedResults] = useState(false)
	const debouncedSearch = useDebouncedValue(searchTerm, 400)
	const previousDebouncedSearch = usePrevious(debouncedSearch)

	useEffect(() => {
		if (isFetching){
			setOpenSuggestedResults(true)
		}
		if (data && !isFetching){
			setSuggestedResults(data)	
			if (data.length == 0){
				setOpenSuggestedResults(false)
			}
		}
	}, [data, isFetching])

	useEffect(() => {
		// checking the previous debounced search will prevent an edge case where upon render, setting the
		// existing search term triggers this call. At that time, debounced search and previous debounced search
		// would have the same value, so the logic prevents that search from occurring. 
		if (previousDebouncedSearch != null && debouncedSearch !== "" && debouncedSearch !== previousDebouncedSearch){
			trigger({search: debouncedSearch})
		}
	}, [debouncedSearch])

	const onChange = (param: string) => {
		setSearchTerm(param)
	}

	const onClickResult = (result: string) => {
		setOpenSuggestedResults(false)
		goTo(SearchResultsPage, {result})
		return
	}

	const onClickOutside = () => {
		setOpenSuggestedResults(false)
	}

	const onFocus = () => {
		if (suggestedResults.length && !openSuggestedResults){
			setOpenSuggestedResults(true)
		}
	}

	const onClear = () => {
		setOpenSuggestedResults(false)
		setSuggestedResults([])
		setSearchTerm("")
	}

	// if clicking outside the autocomplete search suggestions (except on the search bar itself), close the search results
    useClickOutside(searchSuggestionsRef, onClickOutside, searchBarRef)

	return (
		<div className = "relative">
			<form onSubmit={(e) => {
				e.preventDefault()
				onClickResult(searchTerm)
			}}>
				<SearchBar onFocus={onFocus} ref={searchBarRef} onClear={onClear} searchTerm = {searchTerm === "" ? existingSearchTerm : searchTerm} onChange={onChange} placeholder={"Search songs, albums, artists"}/>
				<SearchResults data={suggestedResults} isVisible={openSuggestedResults} ref={searchSuggestionsRef} onClickResult={onClickResult} isLoading={isFetching}/>
			</form>
		</div>
	)	
}