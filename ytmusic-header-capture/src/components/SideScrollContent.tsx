import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { SuggestedContent, OptionType, Playlist as TPlaylist, Track } from "../types/common"
import { PlayableCard } from "./PlayableCard"
import { goTo } from "react-chrome-extension-router"
import { useLazyGetWatchPlaylistQuery, useLazyGetPlaylistTracksQuery } from "../services/private/playlists"
import { useLazyGetRelatedTracksQuery } from "../services/private/songs"
import { useLoadTrack } from "../hooks/useLoadTrack"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { Playlist } from "../pages/Playlist"
import { Album } from "../pages/Album"
import { getThumbnail } from "../helpers/functions"

interface Props {
	content: SuggestedContent
}

export const SideScrollContent = ({content}: Props) => {

	const { isPlaying, currentTrack } = useAppSelector((state) => state.audioPlayer)
	const { playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const [ triggerGetRelatedTracks, { data: relatedTracksData, error: relatedTracksError, isFetching: isFetchingRelatedTracks }] = useLazyGetRelatedTracksQuery();
    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
    // const { triggerLoadTrack } = useLoadTrack()
    const { triggerLoadPlaylist } = useLoadPlaylist()

	const playContent = () => {
    	if ("videoId" in content){
    		// get the watch playlist for this video and load as playlist
    		triggerGetWatchPlaylist({videoId: content?.videoId ?? ""})
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
		if ("subscribers" in content){
			return content?.subscribers ?? ""
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
			return isPlaying && (currentPlaylist?.playlistId === content?.playlistId || currentPlaylist?.playlistId === content?.audioPlaylistId)
		}
		else if ("videoId" in content){
			return isPlaying && currentTrack?.videoId === content?.videoId
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

	useEffect(() => {
		if (!isWatchPlaylistFetching && watchPlaylistData){
			// don't need to load further suggested tracks
			triggerLoadPlaylist({
				playlistId: watchPlaylistData.playlistId,	
				thumbnails: [],
				title: watchPlaylistData.title,
				count: watchPlaylistData.tracks.length,
				description: ""
			} as TPlaylist, watchPlaylistData.tracks, false)
		}
	}, [watchPlaylistData, isWatchPlaylistFetching])

	return (
		<PlayableCard 
			imageHeight={"h-32"}
			imageWidth={"w-32"}
			title={content.title ?? ""}
			thumbnail={getThumbnail(content)}
			description={getDescription()}
			isHeader={false}
			// if the subscribers key is present, this is an artist, which isn't a playable entity
			canPlay={!("subscribers" in content)}
			cardOnClick={!("videoId" in content) ? () => cardClickAction() : undefined}
			imagePlayButtonProps={!("subscribers" in content) ? {
				onPress: () => {
					playContent()
				},
				imageHeight: "h-32", 
			    imageWidth: "w-32",
			    playButtonWidth: "w-6", 
			    playButtonHeight: "h-6",
			    imageURL: getThumbnail(content)?.url ?? "", 
			    showPauseButton: shouldShowPauseButton(),
			} : undefined}
		>
		</PlayableCard>
	)
}
