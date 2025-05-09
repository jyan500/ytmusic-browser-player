import React from "react"
import { useAppSelector } from "../hooks/redux-hooks"
import { OptionType, Track, Playlist, SuggestedContent } from "../types/common"
import { HorizontalPlayableCard } from "./HorizontalPlayableCard"
import { useLoadTrack } from "../hooks/useLoadTrack"
import { getThumbnailUrl } from "../helpers/functions"

interface Props {
	content: Array<SuggestedContent>
}

export const SuggestedContentGrid = ({content}: Props) => {
	const { triggerLoadTrack } = useLoadTrack()
	const { isPlaying, currentTrack } = useAppSelector((state) => state.audioPlayer)
	const getArtists = (sContent: SuggestedContent) => {
		const artistNames = sContent?.artists?.map((artist: OptionType) => artist.name)
		let res = ""
		if (artistNames?.length){
			res = artistNames.join(" - ")
		}
		return res
	}

	const onPress = (content: SuggestedContent) => {
		triggerLoadTrack({} as Playlist, content as Track)
	}

	return (
		<div className="grid grid-flow-col auto-cols-[300px] grid-rows-4 gap-2">
		{
			content.map((sContent: SuggestedContent, index: number) => {
				return (
					<HorizontalPlayableCard
						title={sContent.title ?? ""}	
						description={getArtists(sContent)}
						cardOnClick={() => {}}
						imagePlayButtonProps={
							{
								imageWidth: "w-16",
								imageHeight: "h-16",
								playButtonWidth: "w-6",
								playButtonHeight: "h-6",
								onPress: () => onPress(sContent),
								imageURL: getThumbnailUrl(sContent),
								showPauseButton: isPlaying && currentTrack?.videoId === sContent.videoId
							}
						}
					/>
				)	
			})
		}
		</div>
	)
}