import React from "react"
import { HomeContent, SuggestedContent } from "../types/common"
import { SideScroller } from "./SideScroller"
import { SuggestedContentGrid } from "./SuggestedContentGrid"
import { SuggestedSideScrollContent } from "./SuggestedSideScrollContent"

interface Props {
	content: HomeContent
}

export const SuggestedContentContainer = ({content}: Props) => {
	return (
		<div className = "flex flex-col gap-y-4">
			<SideScroller title={content.title ?? ""} height={content.title !== "Quick picks" ? "h-64" : "h-84"}>
				<div className={`${content.title !== "Quick picks" ? "flex flex-row gap-x-2" : ""}`}>			
					{
						content.title === "Quick picks" ? (
							<SuggestedContentGrid content={content.contents}/>
						) : (
							content.contents.map((sContent: SuggestedContent) => {
								return <SuggestedSideScrollContent content={sContent}/>
							})
						)
					}				
				</div>
			</SideScroller>
		</div>
	)
}
