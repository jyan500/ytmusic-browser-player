import React, { useState, useEffect } from "react"
import { SearchBar } from "./SearchBar"
import { SearchResults } from "./SearchResults"
import { useAppDispatch } from "../../hooks/redux-hooks"
import { useDebouncedValue } from "../../hooks/useDebouncedValue" 
import { useRemoveSearchSuggestionsMutation, useLazyGetSearchSuggestionsQuery } from "../../services/private/search"
import { SearchSuggestionContent } from "../../types/common"
import { SearchResults as SearchResultsPage } from "../../pages/SearchResults"
import { goTo } from "react-chrome-extension-router"
import { addToast } from "../../slices/toastSlice"
import { v4 as uuidv4 } from "uuid"

export const AutoCompleteSearch = () => {
	const dispatch = useAppDispatch()
	const [trigger, {data, isFetching, isError}] = useLazyGetSearchSuggestionsQuery()
	const [searchTerm, setSearchTerm] = useState<string>("")
	const [ suggestedResults, setSuggestedResults ] = useState<Array<SearchSuggestionContent>>([])
	const [ removeSearchSuggestions, {isLoading, error}] = useRemoveSearchSuggestionsMutation()
	const debouncedSearch = useDebouncedValue(searchTerm, 400)
	const [isLoadingForRemoval, setIsLoadingForRemoval] = useState<{isLoading: boolean, index: number}>({
		isLoading: false,	
		index: -1
	})

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

	return (
		<div className = "relative">
			<form onSubmit={(e) => {
				e.preventDefault()
				onClickResult(searchTerm)
			}}>
				<SearchBar onChange={onChange} placeholder={"Search songs, albums, artists"}/>
				{
					isFetching || suggestedResults.length > 0 ? 
					<SearchResults isLoadingForRemoval={isLoadingForRemoval} setIsLoadingForRemoval={setIsLoadingForRemoval} onClickResult={onClickResult} onClickRemove={onClickRemove} data={suggestedResults} isLoading={isFetching}/>
					: null
				}
			</form>
		</div>
	)	
}