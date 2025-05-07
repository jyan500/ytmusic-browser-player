import React from "react"
import { SuggestedContent, OptionType } from "../types/common"
import { PlayableCard } from "./PlayableCard"
import { getThumbnailUrl } from "../helpers/functions"

interface Props {
	content: Array<SuggestedContent>
}

export const SideScroller = ({content}: Props) => {

	const getDescription = (sContent: SuggestedContent): string => {
		if ("playlistId" in sContent){
			if ("description" in sContent){
				return sContent?.description ?? ""
			}
		}
		if ("artists" in sContent){
			const artistNames = sContent?.artists?.map((artist: OptionType) => {
				return artist.name
			})
			if (artistNames){
				return artistNames.join(" - ")
			}
		}
		return ""
	}
	return (
		<div className = "flex flex-row gap-x-2 max-w-[680px] overflow-x-auto">
			{
				content.map((sContent: SuggestedContent) => {
					return (
						<PlayableCard 
							imageHeight={"h-32"}
							title={sContent.title ?? ""}
							description={getDescription(sContent)}
							isHeader={false}
							canPlay={true}
							cardOnClick={() => {}}
							onPress={() => {}}
							imagePlayButtonProps={{
								onPress: () => {
								},
								imageHeight: "h-32", 
							    imageWidth: "w-32",
							    playButtonWidth: "w-6", 
							    playButtonHeight: "h-6",
							    imageURL: getThumbnailUrl(sContent), 
							    showPlayButton: false,
							}}
						>
						</PlayableCard>
					)
				})
			}				
		</div>
	)
}