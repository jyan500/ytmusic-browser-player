import React, {useState, useEffect, useRef} from "react"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"
import { 
	setSuggestedTracks, 
	setShowAudioPlayer, 
	setIsLoading, 
	setIsPlaying, 
	setCurrentTrack, 
	setQueuedTracks, 
	setStoredPlaybackInfo } 
from "../slices/audioPlayerSlice"
import { Album as TAlbum, Playlist, Track } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"
import { useGetPlaylistTracksQuery } from "../services/private/playlists"
import { useGetAlbumQuery } from "../services/private/albums"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { PaginationRow } from "../components/PaginationRow"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { TrackList, Props as TrackListPropType } from "../components/TrackList"
import { PlaylistCardItem } from "../components/PlaylistCardItem"
import { PlayButton } from "../components/PlayButton"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { PlaylistPageContainer } from "../components/PlaylistPageContainer"

interface Props {
	browseId: string 
	audioPlaylistId: string
}

export const Album = ({audioPlaylistId, browseId}: Props) => {
	const [page, setPage] = useState(1)
	const dispatch = useAppDispatch()
	const { triggerLoadPlaylist } = useLoadPlaylist()
	const { isPlaying, queuedTracks, showAudioPlayer, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
	const [ playlist, setPlaylist ] = useState<Playlist | null>(null)
	const { data: albumData, isFetching: isAlbumFetching, isError: isAlbumError} = useGetAlbumQuery(browseId ?? skipToken)
    const { data: tracks, error: tracksError, isFetching: isFetchingTracks } = useGetPlaylistTracksQuery(audioPlaylistId ? {playlistId: audioPlaylistId, params: {}} : skipToken);
	const divRef = useRef<HTMLDivElement | null>(null)

	const getAlbumDescription = (data: TAlbum) => {
		/* 
		Example: 
		Single • 2020
		2 songs • 6 minutes, 52 seconds
		*/
		return `${data.type} • ${data.year}\n ${data.trackCount} songs • ${data.duration}`
	}

	useEffect(() => {
		if (albumData && !isAlbumFetching){
			setPlaylist({
				title: albumData.title,
				playlistId: albumData.audioPlaylistId,
				thumbnails: albumData.thumbnails,	
				description: getAlbumDescription(albumData),
				count: albumData.trackCount,
			} as Playlist)
		}
	}, [albumData, isAlbumFetching])

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		})	
	}, [audioPlaylistId, browseId])

	return (
		tracks && playlist ? <PlaylistPageContainer playlist={playlist} tracks={tracks}/> : <LoadingSpinner/>
	)
}
