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
import { Playlist as TPlaylist, PlaylistInfo, Track, OptionType } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"
import { useGetPlaylistQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { PaginationRow } from "../components/PaginationRow"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { TrackList, Props as TrackListPropType } from "../components/TrackList"
import { PlaylistCardItem } from "../components/PlaylistCardItem"
import { PlayButton } from "../components/PlayButton"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { convertOptionTypesToString } from "../helpers/functions"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { PlaylistPageContainer } from "../components/PlaylistPageContainer"

interface Props {
	playlist: TPlaylist
}

export const Playlist = ({playlist}: Props) => {
	const dispatch = useAppDispatch()
	const { data: playlistData, isFetching, isError } = useGetPlaylistQuery({playlistId: playlist.playlistId, params: {}})

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		})	
	}, [playlist])

	return (
		playlistData ? <PlaylistPageContainer 
			playlist={{
				title: playlistData.title,
				playlistId: playlistData.id,
				thumbnails: playlistData.thumbnails,	
				// should be okay to use the author based on the home page playlist data, as it should be static
				// and not changing. The count needs to be pulled from playlistInfo data in order to be updated
				// when an item is added/removed from the playlist though.
				description: playlist.author?.[0] ? convertOptionTypesToString([playlist.author[0], {id: "", name: `${playlistData.trackCount.toString()} tracks`}]) : playlist.description,
				count: playlistData.trackCount,
				tracks: playlistData.tracks,	
			} as TPlaylist} 
			tracks={playlistData.tracks}/> : <LoadingSpinner/>
	)
}
