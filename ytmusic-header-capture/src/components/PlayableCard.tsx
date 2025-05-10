import React from "react"
import { Props as ImagePlayButtonProps, ImagePlayButton } from "./ImagePlayButton"
import { Thumbnail } from "../types/common"

interface PlayableCardProps {
	thumbnail?: Thumbnail | undefined
	title: string,
	description: string,
	children?: React.ReactNode
	isHeader?: boolean
	imageHeight?: string
	canPlay?: boolean
	cardOnClick?: () => void
	onPress?: () => void
	imagePlayButtonProps?: ImagePlayButtonProps
}

export const PlayableCard = ({
	imageHeight, 
	isHeader, 
	title,
	description,
	thumbnail, 
	canPlay, 
	cardOnClick, 
	imagePlayButtonProps,
	children
}: PlayableCardProps) => {
	const titleDescription = () => {
		return (
			<>
				<p className = {`${isHeader ? "text-md" : ""} font-semibold`}>{title}</p>
				<p className = "text-gray-300">{description}</p>
			</>
		)
	}
	return (
		<>
			<div className={`${isHeader ? "items-center" : "items-start"} flex flex-col gap-y-2 group`}>
				{
					canPlay && imagePlayButtonProps ? 
					<ImagePlayButton
						imageHeight={imagePlayButtonProps?.imageHeight ?? "h-32"}
						imageWidth={imagePlayButtonProps?.imageWidth ?? "w-32"}
						playButtonWidth={imagePlayButtonProps?.playButtonWidth ?? "w-6"}
						playButtonHeight={imagePlayButtonProps?.playButtonHeight ?? "h-6"}
						onPress={imagePlayButtonProps?.onPress}
						imageURL={imagePlayButtonProps?.imageURL}
						showPauseButton={imagePlayButtonProps?.showPauseButton}

					/> :
					<img loading="lazy" className={`${imageHeight ?? "h-32"} object-fill`} src = {thumbnail?.url}/>
				}
				{
					isHeader ? 
					<div className = {`text-center text-lg break-words`}>
						{titleDescription()}
					</div> :
					<button onClick={cardOnClick} className = {`text-left break-words`}>
						{titleDescription()}
					</button>
				}
			</div>
			{children}	
		</>
	)
}
