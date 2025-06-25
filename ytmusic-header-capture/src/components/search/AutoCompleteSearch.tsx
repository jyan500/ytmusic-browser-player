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

interface Props {
	existingSearchTerm?: string
}

export const AutoCompleteSearch = ({existingSearchTerm = ""}: Props) => {
	const dispatch = useAppDispatch()
	const searchSuggestionsRef = useRef<HTMLDivElement>(null)
	const searchBarRef = useRef<HTMLDivElement>(null)
	const [trigger, {data, isFetching, isError}] = useLazyGetSearchSuggestionsQuery()
	const [searchTerm, setSearchTerm] = useState<string>("")
	const [ suggestedResults, setSuggestedResults ] = useState<Array<SearchSuggestionContent>>([])
	const [ openSuggestedResults, setOpenSuggestedResults] = useState(false)
	const [ removeSearchSuggestions, {isLoading, error}] = useRemoveSearchSuggestionsMutation()
	const debouncedSearch = useDebouncedValue(searchTerm, 400)
	const [isLoadingForRemoval, setIsLoadingForRemoval] = useState<{isLoading: boolean, index: number}>({
		isLoading: false,	
		index: -1
	})

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
		if (debouncedSearch !== ""){
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

	const onClickRemove = async (index: number) => {
		const id = uuidv4()
		try {
			await removeSearchSuggestions({suggestions: data, index: index}).unwrap()
			dispatch(addToast({
				id,			
				animationType: "animation-in",
				message: "Search suggestion removed successfully!",
			}))
		}
		catch (e) {
			dispatch(addToast({
				id,			
				animationType: "animation-in",
				message: "Something went wrong when removing search suggestion.",
			}))
		}
		finally {
			setIsLoadingForRemoval({isLoading: false, index: -1})
		}
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
				{
					openSuggestedResults ? 
					<SearchResults ref={searchSuggestionsRef} isLoadingForRemoval={isLoadingForRemoval} setIsLoadingForRemoval={setIsLoadingForRemoval} onClickResult={onClickResult} onClickRemove={onClickRemove} data={suggestedResults} isLoading={isFetching}/>
					: null
				}
			</form>
		</div>
	)	
}