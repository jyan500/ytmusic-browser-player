import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { SuggestedContent, OptionType, Playlist as TPlaylist, Track } from "../types/common"
import { PlayableCard } from "./PlayableCard"
import { goTo } from "react-chrome-extension-router"
import { useLazyGetPlaylistTracksQuery } from "../services/private/playlists"
import { useLoadTrack } from "../hooks/useLoadTrack"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { Playlist } from "../pages/Playlist"
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
    	else if ("playlistId" in content){
			triggerGetTracks({playlistId: content.playlistId ?? "", params: {}})
    	}
    }

	const cardClickAction = () => {
    	// if it's a playlist, enter the playlist page
    	if (!("videoId" in content) && "playlistId" in content){
    		// not the exact same type, but it should share the playlistId which is necessary
    		goTo(Playlist, {playlist: content as TPlaylist})
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
				return artistNames.join(" - ")
			}
		}
		return ""
	}

	const shouldShowPauseButton = () => {
		if ("playlistId" in content){
			return isPlaying && currentPlaylist?.playlistId === content?.playlistId
		}
		else if ("videoId" in content){
			return isPlaying && currentTrack?.videoId !== content?.videoId
		}
		return false 
	}

	useEffect(() => {
		if (!isFetchingTracks && tracksData){
			triggerLoadPlaylist(content as TPlaylist, tracksData)
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