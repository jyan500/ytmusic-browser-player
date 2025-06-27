import React from "react"
import { OptionType, SuggestedContent } from "../types/common" 

interface Props {
	description: React.ReactNode
}

export const LinkableDescription = ({description}: Props) => {
	return (
		<>
			<p className = "whitespace-pre-wrap break-normal text-gray-300">{description}</p>
		</>
	)	
}
