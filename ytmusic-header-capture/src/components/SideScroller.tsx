import React from "react"
import { SuggestedContent } from "../types/common"

interface Props {
	content: Array<SuggestedContent>
}

export const SideScroller = ({content}: Props) => {
	return (
		<div className = "flex flex-row gap-x-2 max-w-[500px] overflow-x-auto">
			{
				content.map((content) => {
					return (
					)
				})
			}				
		</div>
	)
}