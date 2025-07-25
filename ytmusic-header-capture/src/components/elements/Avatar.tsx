import React from "react"
import { IconUser } from "../../icons/IconUser"

type Props = {
	size?: string 
	className?: string
	imageUrl: string | undefined
}

export const Avatar = ({size="s", className, imageUrl}: Props) => {
	const sizes: {[k: string]: string} = {
		"l": "tw-w-32 tw-h-32",
		"m": "tw-w-16 tw-h-16",
		"s": "tw-w-6 tw-h-6",
	}
	const cName = `${size && size in sizes ? sizes[size] : sizes.s} ${className}` 
	const defaultIcon = () => {
		return (
			<IconUser className={cName}/>
		)
	}
	return ( 
		<>
			{imageUrl ? <img className = {cName} src={imageUrl}/> : defaultIcon()}
		</>
	)
}

