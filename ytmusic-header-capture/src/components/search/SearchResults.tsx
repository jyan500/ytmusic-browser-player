import React, { useState } from "react"
import { SearchSuggestionContent } from "../../types/common"
import { LoadingSpinner } from "../elements/LoadingSpinner"
import { useAppDispatch } from "../../hooks/redux-hooks"
import { IconSearch } from "../../icons/IconSearch"
import { IconHistory } from "../../icons/IconHistory"
import { IconClose } from "../../icons/IconClose"
import { useRemoveSearchSuggestionsMutation } from "../../services/private/search" 
import { v4 as uuidv4 } from "uuid"
import { addToast } from "../../slices/toastSlice"

interface Props {
	data: Array<SearchSuggestionContent>
	isLoading?: boolean
	onClickResult: (result: string) => void
	isVisible: boolean
}

export const SearchResults = React.forwardRef<HTMLDivElement, Props>(({
	data, 
	onClickResult, 
	isLoading=false,
	isVisible,
}: Props, ref) => {

	const dispatch = useAppDispatch()
	const [ removeSearchSuggestions, {isLoading: isRemoveSearchLoading, error}] = useRemoveSearchSuggestionsMutation()
	const [isLoadingForRemoval, setIsLoadingForRemoval] = useState<{isLoading: boolean, index: number}>({
		isLoading: false,	
		index: -1
	})

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
		<div ref={ref} className = {`${isVisible ? "visible" : "invisible"} flex flex-col gap-y-2 p-2 w-full bg-dark absolute z-10 rounded-md max-h-60 overflow-y-auto`}>
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
								onClickResult(d.text)
							}
							} className = "hover:opacity-60 flex flex-row items-center gap-x-2">
								{d.fromHistory ? <IconHistory className = "w-3 h-3"/> : <IconSearch className="w-3 h-3"/>}
								<p>{d.text}</p>
							</a>
							{
								isLoadingForRemoval.index == i ? <LoadingSpinner width={"w-3"} height={"h-3"}/> : (
									<a className = {d.fromHistory ? "visible" : "invisible"} onClick={(e) => {
										if (d.fromHistory){
											e.preventDefault()
											setIsLoadingForRemoval({
												isLoading: false,
												index: i 
											})
											// onClickRemove(i)
										}
									}}><IconClose className = "w-3 h-3"/></a>
								)
							}
						</div>
					)) : null
				}
			</div>
		</div>
	)	
})