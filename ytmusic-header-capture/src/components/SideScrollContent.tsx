import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { SuggestedContent, OptionType, Playlist as TPlaylist, Track } from "../types/common"
import { PlayableCard } from "./PlayableCard"
import { goTo } from "react-chrome-extension-router"
import { useLazyGetPlaylistTracksQuery } from "../services/private/playlists"
import { useLoadTrack } from "../hooks/useLoadTrack"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { Playlist } from "../pages/Playlist"
import { Album } from "../pages/Album"
import { getThumbnailUrl } from "../helpers/functions"

interface Props {
	content: SuggestedContent
}

export const SideScrollContent = ({content}: Props) => {

	const { isPlaying, currentTrack } = useAppSelector((state) => state.audioPlayer)
	const { playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const { triggerLoadTrack } = useLoadTrack()
    const { triggerLoadPlaylist } = useLoadPlaylist()

	const playContent = () => {
    	if ("videoId" in content){
    		// pull the song information and queue up the track
    		// pull suggested content
    		triggerLoadTrack(undefined, content as Track)
    	}
    	else if ("playlistId" in content || "audioPlaylistId" in content){
			triggerGetTracks({playlistId: "playlistId" in content ? (content.playlistId ?? "") : (content.audioPlaylistId ?? ""), params: {}})
    	}
    }

	const getDescription = (): string => {
		if ("playlistId" in content){
			if ("description" in content){
				return content?.description ?? ""
			}
		}
		if ("artists" in content){
			const artistNames = content?.artists?.map((artist: OptionType) => {
				return artist.name
			})
			if (artistNames){
				return artistNames.join(" • ")
			}
		}
		return ""
	}

	const shouldShowPauseButton = () => {
		if ("playlistId" in content || "audioPlaylistId" in content){
			console.log("currentPlaylist: ", currentPlaylist)
			console.log("content.playlistId: ", content.playlistId)
			console.log("content.audioPlaylistId: ", content.audioPlaylistId)
			return isPlaying && (currentPlaylist?.playlistId === content?.playlistId || currentPlaylist?.playlistId === content?.audioPlaylistId)
		}
		else if ("videoId" in content){
			return isPlaying && currentTrack?.videoId !== content?.videoId
		}
		return false 
	}

	const cardClickAction = () => {
    	// if it's a playlist, enter the playlist page
    	if (!("videoId" in content)){
    		if ("playlistId" in content){
    			goTo(Playlist, {playlist: content})
    		}
    		else if ("audioPlaylistId" in content && "browseId" in content){
    			goTo(Album, {browseId: content.browseId, audioPlaylistId: content.audioPlaylistId})
    		}
    	}
    }


	useEffect(() => {
		if (!isFetchingTracks && tracksData){
			// include the playlistId as audioPlaylistId for album playlists
			triggerLoadPlaylist({
				...content,
				playlistId: "audioPlaylistId" in content ? content.audioPlaylistId : content.playlistId,
			} as TPlaylist, tracksData)
		}
	}, [tracksData, isFetchingTracks])

	return (
		<PlayableCard 
			imageHeight={"h-32"}
			title={content.title ?? ""}
			description={getDescription()}
			isHeader={false}
			canPlay={true}
			cardOnClick={() => cardClickAction()}
			imagePlayButtonProps={{
				onPress: () => {
					playContent()
				},
				imageHeight: "h-32", 
			    imageWidth: "w-32",
			    playButtonWidth: "w-6", 
			    playButtonHeight: "h-6",
			    imageURL: getThumbnailUrl(content), 
			    showPauseButton: shouldShowPauseButton(),
			}}
		>
		</PlayableCard>
	)
}
