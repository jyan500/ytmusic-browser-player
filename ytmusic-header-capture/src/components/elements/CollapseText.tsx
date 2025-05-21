import React, {useState} from "react"
import { ActionButton } from "./ActionButton"

interface Props {
	text: string
	className?: string
	lineClamp: string	
}

export const CollapseText = ({text, className, lineClamp}: Props) => {
	const [showFull, setShowFull] = useState(false)
	return (
		<div className={`${className}`}>
			{
				showFull ? 
					<div>
						<p>{text}</p>
					</div>
				:
				<div className = {lineClamp}>
					<p>{text}</p>
				</div>
			}
			<ActionButton onClick={() => setShowFull(!showFull)} text={!showFull ? "More" : "Less"}/>
		</div>
	)
}
