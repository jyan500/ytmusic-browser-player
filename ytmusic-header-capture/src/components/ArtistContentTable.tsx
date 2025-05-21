import React, {useEffect} from "react"
import { useAppSelector } from "../hooks/redux-hooks"
import { OptionType, Track, Playlist, ArtistContent } from "../types/common"
import { HorizontalPlayableCard } from "./HorizontalPlayableCard"
import { useLazyGetWatchPlaylistQuery } from "../services/private/playlists"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { convertOptionTypesToString, getThumbnail } from "../helpers/functions"
import { ImagePlayButton } from "./ImagePlayButton"

interface Props {
	content: Array<ArtistContent>
}

export const ArtistContentTable = ({content}: Props) => {
    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
	const { isPlaying, currentTrack } = useAppSelector((state) => state.audioPlayer)
	const { triggerLoadPlaylist } = useLoadPlaylist()

	const shouldShowPauseButton = () => {
		return currentTrack && currentTrack?.videoId === content?.videoId	
	}

	const onPress = (artistContent: ArtistContent) => {
		triggerGetWatchPlaylist({videoId: artistContent?.videoId ?? ""})
	}

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
		<div className="w-full table table-auto border-collapse">
			{
				content.map((c: ArtistContent, index: number) => {
					return (
						<tr className = {`${index < content.length - 1 ? "border-b border-zinc-400" : ""} mb-2`}>
							<td className="py-1 align-middle">
								<ImagePlayButton
									imageHeight={"w-12"}
								    imageWidth={"h-12"} 
								    playButtonWidth={"w-6"} 
								    isAvailable={c.isAvailable}
								    playButtonHeight={"h-6"}
								    imageURL={getThumbnail(c)?.url ?? ""}
								    onPress={() => onPress(c)}
								    showPauseButton={shouldShowPauseButton()}	
								>
								</ImagePlayButton>
							</td>	
							<td className = "py-1 align-middle overflow-hidden truncate">{c.title}</td>	
							<td className = "py-1 align-middle overflow-hidden truncate">{c.artists?.length ? convertOptionTypesToString(c.artists, " & ") : ""}</td>	
							<td className = "py-1 align-middle overflow-hidden truncate">{c.album?.name ?? ""}</td>	
						</tr>
					)
				})
			}
		</div>
	)
}
