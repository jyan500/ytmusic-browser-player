import React from "react"
import { SearchSuggestionContent } from "../../types/common"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { IconSearch } from "../../icons/IconSearch"
import { IconHistory } from "../../icons/IconHistory"
import { IconClose } from "../../icons/IconClose"

interface Props {
	data: Array<SearchSuggestionContent>
	isLoading?: boolean
	onClickResult: (result: string) => void
	onClickRemove: (index: number) => void
	setIsLoadingForRemoval: (isLoadingForRemoval: {isLoading: boolean, index: number}) => void
	isLoadingForRemoval: {isLoading: boolean, index: number}
}

export const SearchResults = React.forwardRef<HTMLDivElement, Props>(({
	data, 
	onClickResult, 
	onClickRemove, 
	setIsLoadingForRemoval, 
	isLoadingForRemoval, 
	isLoading=false
}: Props, ref) => {
	return (
		<div ref={ref} className = "flex flex-col gap-y-2 p-2 w-full bg-dark absolute z-10 rounded-md max-h-60 overflow-y-auto">
			<div>
				{
					isLoading ? <LoadingSpinner width={"w-4"} height={"h-4"}/> : null
				}
			</div>
			<div className = "flex flex-col gap-y-2">
				{
					data != null && data?.length > 0 ? data.map((d: SearchSuggestionContent, i: number) => (
						<div className = "flex flex-row justify-between items-center">
							<a onClick={(e) => {
								e.preventDefault()
								onClickResult(d.text)}
							} className = "hover:opacity-60 flex flex-row items-center gap-x-2">
								{d.fromHistory ? <IconHistory className = "w-3 h-3"/> : <IconSearch className="w-3 h-3"/>}
								<p>{d.text}</p>
							</a>
							{
								d.fromHistory ? (
									isLoadingForRemoval.index == i ? <LoadingSpinner width={"w-3"} height={"h-3"}/> : (
										<a onClick={(e) => {
											e.preventDefault()
											onClickRemove(i)
											setIsLoadingForRemoval({isLoading: true, index: i})
										}}><IconClose className = "w-3 h-3"/></a>
									)
								) : null
							}
						</div>
					)) : null
				}
			</div>
		</div>
	)	
})