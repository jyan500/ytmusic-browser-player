import React, { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { UserContent, ContainsArtists, ArtistContent, OptionType, Playlist as TPlaylist, Track } from "../types/common"
import { PlayableCard } from "./PlayableCard"
import { goTo } from "react-chrome-extension-router"
import { useLazyGetWatchPlaylistQuery, useLazyGetPlaylistTracksQuery } from "../services/private/playlists"
import { useLazyGetRelatedTracksQuery } from "../services/private/songs"
import { useLazyGetAlbumQuery } from "../services/private/albums"
import { useLoadTrack } from "../hooks/useLoadTrack"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { Playlist } from "../pages/Playlist"
import { Artist } from "../pages/Artist"
import { Album } from "../pages/Album"
import { getThumbnail } from "../helpers/functions"
import { SideScrollContent } from "./SideScrollContent"
import { LinkableDescription } from "./LinkableDescription"
import { ArtistDescription } from "./ArtistDescription"
import { v4 as uuidv4 } from "uuid"
import { setCurrentCardId } from "../slices/audioPlayerSlice"

interface Props {
	content: UserContent 
}

export const UserScrollContent = ({content}: Props) => {
	const dispatch = useAppDispatch()
	const { isPlaying, currentTrack } = useAppSelector((state) => state.audioPlayer)
	const { playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const [ triggerGetRelatedTracks, { data: relatedTracksData, error: relatedTracksError, isFetching: isFetchingRelatedTracks }] = useLazyGetRelatedTracksQuery();
    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
    const [ triggerGetAlbum, {data: albumData, error: albumError, isFetching: isAlbumFetching } ] = useLazyGetAlbumQuery()
    const { triggerLoadPlaylist } = useLoadPlaylist()
    const id = useRef(uuidv4())

	const playContent = () => {
    	if ("videoId" in content){
    		// get the watch playlist for this video and load as playlist
    		triggerGetWatchPlaylist({videoId: content?.videoId ?? ""})
    	}
    	else if ("playlistId" in content) {
			triggerGetTracks({playlistId: content.playlistId, params: {}})
    	}
    	dispatch(setCurrentCardId(id.current))
    }

	const getLinkableDescription = () => {
		if ("description" in content){
			return <>{content.description}</>
		}
		else if ("artists" in content){
			return <ArtistDescription content={content as ContainsArtists}/>
		}
		return <></>
	}

	const shouldShowPauseButton = () => {
		if ("playlistId" in content && content.playlistId != null){
			return isPlaying && currentPlaylist?.playlistId === content.playlistId
		}
		else if ("videoId" in content && content.videoId != null) {
			return isPlaying && currentTrack?.videoId === content.videoId
		}
		return false 
	}

	const cardClickAction = () => {
    	// if it's a playlist, enter the playlist page
    	if ("playlistId" in content){
			goTo(Playlist, {playlist: content})
			return
    	}
    }

	useEffect(() => {
		if (!isFetchingTracks && tracksData){
			triggerLoadPlaylist({
				...content,
				playlistId: content.playlistId,
			} as TPlaylist, tracksData, true)
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
				description: "",
				tracks: watchPlaylistData.tracks,
			} as TPlaylist, watchPlaylistData.tracks, false)
		}
	}, [watchPlaylistData, isWatchPlaylistFetching])

	return (
		<SideScrollContent 
			id={id.current}
			title={content.title ?? ""}
			thumbnail={getThumbnail(content)}
			description={content?.description ?? ""}
			canPlay={true}
			cardClickAction={() => cardClickAction()}
			isCircular={false}
			playContent={() => playContent()}
			showPauseButton={shouldShowPauseButton()}
			linkableDescription={<LinkableDescription description={getLinkableDescription()}/>}
		>
		</SideScrollContent>
	)
}
