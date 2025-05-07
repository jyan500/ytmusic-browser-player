import React from "react"
import { HomeContent } from "../types/common"
import { SideScroller } from "./SideScroller"

interface Props {
	content: HomeContent
}

export const SuggestedContentContainer = ({content}: Props) => {
	return (
		<div className = "flex flex-col gap-y-4">
			<SideScroller title={content?.title} content={content?.contents ?? []}/>
		</div>
	)
}