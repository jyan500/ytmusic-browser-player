import React from "react"
import { SearchSuggestionContent } from "../../types/common"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { IconSearch } from "../../icons/IconSearch"
import { IconHistory } from "../../icons/IconHistory"

interface Props {
	data: Array<SearchSuggestionContent>
	isLoading?: boolean
	onClickResult: (result: string) => void
}

export const SearchResults = ({data, onClickResult, isLoading=false}: Props) => {
	return (
		<div className = "flex flex-col gap-y-2 p-2 w-full bg-dark absolute z-10 rounded-md max-h-60 overflow-y-auto">
			<div>
				{
					isLoading ? <LoadingSpinner width={"w-4"} height={"h-4"}/> : null
				}
			</div>
			<div className = "flex flex-col gap-y-2">
				{
					data != null && data?.length > 0 ? data.map((d: SearchSuggestionContent) => (
						<a onClick={(e) => {
							e.preventDefault()
							onClickResult(d.text)}
						} className = "hover:opacity-60 flex flex-row items-center gap-x-2">
							{d.fromHistory ? <IconHistory className = "w-3 h-3"/> : <IconSearch className="w-3 h-3"/>}
							<p>{d.text}</p>
						</a>
					)) : null
				}
			</div>
		</div>
	)	
}