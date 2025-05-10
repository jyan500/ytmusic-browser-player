import React from "react"
import { Props as ImagePlayButtonProps, ImagePlayButton } from "./ImagePlayButton"
import { Thumbnail } from "../types/common"

interface HorizontalPlayableCardProps {
	title: string
	description: string
	cardOnClick?: () => void
	imagePlayButtonProps?: ImagePlayButtonProps
}

export const HorizontalPlayableCard = ({
	title,
	description,
	cardOnClick, 
	imagePlayButtonProps,
}: HorizontalPlayableCardProps) => {
	const titleDescription = () => {
		return (
			<>
				<p className = {`font-semibold overflow-hidden truncate`}>{title}</p>
				<p className = "text-gray-300 overflow-hidden truncate">{description}</p>
			</>
		)
	}
	return (
		<>
			<div className={`flex flex-row gap-x-2 items-start group`}>
				<div className = {`${imagePlayButtonProps?.imageHeight ?? "h-16"} ${imagePlayButtonProps?.imageWidth ?? "w-16"}`}>
					{
						imagePlayButtonProps ? 
						<ImagePlayButton
							imageHeight={imagePlayButtonProps?.imageHeight ?? "h-32"}
							imageWidth={imagePlayButtonProps?.imageWidth ?? "w-32"}
							playButtonWidth={imagePlayButtonProps?.playButtonWidth ?? "w-6"}
							playButtonHeight={imagePlayButtonProps?.playButtonHeight ?? "h-6"}
							onPress={imagePlayButtonProps?.onPress}
							imageURL={imagePlayButtonProps?.imageURL}
							showPauseButton={imagePlayButtonProps?.showPauseButton}

						/> : null 
					}
				</div>
				{
					<button onClick={cardOnClick} className = {`text-left overflow-hidden truncate`}>
						{titleDescription()}
					</button>
				}
			</div>
		</>
	)
}
