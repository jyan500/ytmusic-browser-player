import React, {useEffect} from "react"
import { useAppSelector } from "../hooks/redux-hooks"
import { OptionType, Track, Playlist, SuggestedContent } from "../types/common"
import { HorizontalPlayableCard } from "./HorizontalPlayableCard"
import { useLazyGetWatchPlaylistQuery } from "../services/private/playlists"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { getThumbnailUrl } from "../helpers/functions"

interface Props {
	content: Array<SuggestedContent>
}

export const SuggestedContentGrid = ({content}: Props) => {
    // const [ triggerGetRelatedTracks, { data: relatedTracksData, error: relatedTracksError, isFetching: isFetchingRelatedTracks }] = useLazyGetRelatedTracksQuery();
    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
	const { isPlaying, currentTrack } = useAppSelector((state) => state.audioPlayer)
	const { triggerLoadPlaylist } = useLoadPlaylist()
	const getArtists = (sContent: SuggestedContent) => {
		const artistNames = sContent?.artists?.map((artist: OptionType) => artist.name)
		let res = ""
		if (artistNames?.length){
			res = artistNames.join(" • ")
		}
		return res
	}

	const onPress = (content: SuggestedContent) => {
		// triggerLoadTrack({} as Playlist, content as Track)
		triggerGetWatchPlaylist({videoId: content?.videoId ?? ""})
	}

	// useEffect(() => {
	// 	if (!isFetchingRelatedTracks && relatedTracksData){
	// 	}	
	// }, [relatedTracksData, isFetchingRelatedTracks])

	useEffect(() => {
		if (!isWatchPlaylistFetching && watchPlaylistData){
			// don't need to load further suggested tracks
			triggerLoadPlaylist({
				playlistId: watchPlaylistData.playlistId,	
				thumbnails: [],
				title: watchPlaylistData.title,
				count: watchPlaylistData.tracks.length,
				description: ""
			} as Playlist, watchPlaylistData.tracks, false)
		}
	}, [watchPlaylistData, isWatchPlaylistFetching])

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
