import React, {useEffect, useRef} from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { OptionType, Track, Playlist, ArtistContent } from "../types/common"
import { HorizontalPlayableCard } from "./HorizontalPlayableCard"
import { useLazyGetWatchPlaylistQuery } from "../services/private/playlists"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { convertOptionTypesToString, getThumbnail } from "../helpers/functions"
import { ImagePlayButton } from "./ImagePlayButton"
import { SEPARATOR } from "../helpers/constants"
import { setCurrentCardId } from "../slices/audioPlayerSlice"
import { v4 as uuidv4 } from "uuid"

interface Props {
	content: Array<ArtistContent>
}

export const ArtistContentTable = ({content}: Props) => {
	const dispatch = useAppDispatch()
    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
	const { isPlaying, currentTrack } = useAppSelector((state) => state.audioPlayer)
	const { triggerLoadPlaylist } = useLoadPlaylist()
	const id = useRef(uuidv4())

	const onPress = (artistContent: ArtistContent) => {
		triggerGetWatchPlaylist({videoId: artistContent?.videoId ?? ""})
		dispatch(setCurrentCardId(id.current))
	}

	useEffect(() => {
		if (!isWatchPlaylistFetching && watchPlaylistData){
			// don't need to load further suggested tracks
			triggerLoadPlaylist({
				playlistId: watchPlaylistData.playlistId,	
				thumbnails: [],
				title: watchPlaylistData.title,
				count: watchPlaylistData.tracks.length,
				description: "",
				tracks: watchPlaylistData.tracks,
			} as Playlist, watchPlaylistData.tracks, false)
		}
	}, [watchPlaylistData, isWatchPlaylistFetching])

	return (
		<table className="w-full table table-fixed overflow-x-auto border-collapse">
			{
				content.map((c: ArtistContent, index: number) => {
					return (
						<tr className = {`${index < content.length - 1 ? SEPARATOR : ""} mb-2`}>
							<td className="w-14 py-1 align-middle group">
								<ImagePlayButton
									id={id.current}
									imageHeight={"w-12"}
								    imageWidth={"h-12"} 
								    playButtonWidth={"w-4"} 
								    isAvailable={c.isAvailable}
								    playButtonHeight={"h-4"}
								    imageURL={getThumbnail(c)?.url ?? ""}
								    onPress={() => onPress(c)}
								    showPauseButton={currentTrack != null && "videoId" in c && currentTrack.videoId === c.videoId}	
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
		</table>
	)
}
