import React from "react"
import { HomeContent } from "../types/common"
import { SideScroller } from "./SideScroller"

interface Props {
	content: HomeContent
}

export const SuggestedContentContainer = ({content}: Props) => {
	return (
		<div className = "flex flex-col gap-y-2">
			<p className = "text-xl">{content.title}</p>
			<SideScroller content={content?.contents ?? []}/>
		</div>
	)
}