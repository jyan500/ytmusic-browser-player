import React from "react"
import { LoadingSpinner } from "./LoadingSpinner"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	text: string
	isLoading?: boolean
}

export const ActionButton = ({text, isLoading=false, ...props}: ButtonProps) => {
	return (
		<button className = "hover:opacity-60 p-2 border border-white rounded-lg" {...props}>
			<div className = "flex flex-row gap-x-2 items-center">
				{text}
				{isLoading ? <LoadingSpinner width={"w-4"} height={"h-4"}/> : null}
			</div>
		</button>
	)
}
