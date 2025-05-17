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
import { Playlist as TPlaylist, PlaylistInfo, Track } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"
import { useGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { PaginationRow } from "../components/PaginationRow"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { TrackList, Props as TrackListPropType } from "../components/TrackList"
import { PlaylistCardItem } from "../components/PlaylistCardItem"
import { PlayButton } from "../components/PlayButton"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { prepareQueueItems, randRange } from "../helpers/functions"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { PlaylistPageContainer } from "../components/PlaylistPageContainer"

interface Props {
	playlist: TPlaylist
}

export const Playlist = ({playlist}: Props) => {
	const dispatch = useAppDispatch()
	const {data: tracks, isLoading: isTracksLoading, isError: isTracksError} = useGetPlaylistTracksQuery(playlist ? {playlistId: playlist.playlistId, params: {}} : skipToken)

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		})	
	}, [playlist])

	return (
		playlist && tracks ? <PlaylistPageContainer playlist={playlist} tracks={tracks}/> : <LoadingSpinner/>
	)
}
