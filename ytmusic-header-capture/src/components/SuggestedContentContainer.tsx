import React from "react"
import { HomeContent } from "../types/common"

interface Props {
	content: HomeContent
}

export const SuggestedContentContainer = ({content}: Props) => {
	return (
		<div>
			<p className = "text-xl">{content.title}</p>
		</div>
	)
}