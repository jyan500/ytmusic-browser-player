import React, { useRef, useEffect} from "react"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"
import { ContainsArtists, OptionType, Track, Playlist, SuggestedContent } from "../types/common"
import { HorizontalPlayableCard } from "./HorizontalPlayableCard"
import { useLazyGetWatchPlaylistQuery } from "../services/private/playlists"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { getThumbnail } from "../helpers/functions"
import { LinkableDescription } from "./LinkableDescription"
import { ArtistDescription } from "./ArtistDescription"
import { setCurrentCardId } from "../slices/audioPlayerSlice"
import { v4 as uuidv4 } from "uuid"

interface Props {
	content: Array<SuggestedContent>
}

export const SuggestedContentGrid = ({content}: Props) => {
    // const [ triggerGetRelatedTracks, { data: relatedTracksData, error: relatedTracksError, isFetching: isFetchingRelatedTracks }] = useLazyGetRelatedTracksQuery();
    const dispatch = useAppDispatch()
    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
	const { isPlaying, currentTrack, currentCardId } = useAppSelector((state) => state.audioPlayer)
	const { triggerLoadPlaylist } = useLoadPlaylist()

	const getArtists = (sContent: SuggestedContent) => {
		const artistNames = sContent?.artists?.map((artist: OptionType) => artist.name)
		let res = ""
		if (artistNames?.length){
			res = artistNames.join(" • ")
		}
		return res
	}

	const getLinkableDescription = (sContent: SuggestedContent): React.ReactNode => {
		if ("artists" in sContent){
			return <ArtistDescription content={sContent as ContainsArtists}/>
		}
		return <></>
	}

	const onPress = (content: SuggestedContent, id: string) => {
		// triggerLoadTrack({} as Playlist, content as Track)
		triggerGetWatchPlaylist({videoId: content?.videoId ?? ""})
		dispatch(setCurrentCardId(id))
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
				description: "",
				tracks: watchPlaylistData.tracks
			} as Playlist, watchPlaylistData.tracks, false)
		}
	}, [watchPlaylistData, isWatchPlaylistFetching])

	return (
		<div className="grid grid-flow-col auto-cols-[300px] grid-rows-4 gap-2">
		{
			content.map((sContent: SuggestedContent, index: number) => {
				const id = `suggested-content-grid-card-${index}` 
				return (
					<HorizontalPlayableCard
						id={id}
						title={sContent.title ?? ""}	
						description={getArtists(sContent)}
						content={sContent}
						linkableDescription={<LinkableDescription description={getLinkableDescription(sContent)}/>}
						cardOnClick={() => {}}
						imagePlayButtonProps={
							{
								id: id,
								imageWidth: "w-16",
								imageHeight: "h-16",
								playButtonWidth: "w-6",
								playButtonHeight: "h-6",
								onPress: () => onPress(sContent, id),
								imageURL: getThumbnail(sContent)?.url ?? "",
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
