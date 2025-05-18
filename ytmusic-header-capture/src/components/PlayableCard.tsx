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
	imageWidth?: string
	canPlay?: boolean
	cardOnClick?: () => void
	onPress?: () => void
	imagePlayButtonProps?: ImagePlayButtonProps
}

export const PlayableCard = ({
	imageHeight, 
	imageWidth,
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
				{/* whitespace prewrap allows /n to show for displaying multiline descriptions in strings */}
				<p className = "whitespace-pre-wrap text-gray-300">{description}</p>
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
					<div className = {`${imageWidth ?? ""} ${imageHeight ?? ""}`}>
						<img loading="lazy" className={`${imageHeight ?? "h-32"} object-fill`} src = {thumbnail?.url}/>
					</div>
				}
				{
					isHeader || !cardOnClick ? 
					<div className = {`${isHeader ? "text-lg text-center" : "text-left" } break-words`}>
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
