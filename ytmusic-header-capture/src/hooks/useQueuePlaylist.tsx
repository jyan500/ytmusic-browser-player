import React, { useState, useEffect } from "react"
import { Playlist, Track } from "../types/common"
import { useAppDispatch, useAppSelector } from "./redux-hooks"
import { setSuggestedTracks, setIndex, setIsLoading, setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setShowAudioPlayer } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist as setCurrentPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { prepareQueueItems, randRange } from "../helpers/functions"
import { useLoadPlaylist } from "./useLoadPlaylist"

/* 
	Exposes a "triggerLoadPlaylist" function that takes in tracks data, and queues
	up all tracks into queued tracks on the redux store. Also pulls playback for the first song
	on the queue, and pulls related track information
*/
export const useQueuePlaylist = () => {
	const dispatch = useAppDispatch()	
	const { showAudioPlayer, suggestedTracks, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ triggerGetPlayback, { data: songData, error: songError, isFetching: isFetchingSong } ] = useLazyGetSongPlaybackQuery()
    const [ triggerRelatedTracks, {data: relatedTracksData, error: relatedTracksError, isFetching: isRelatedTracksFetching}] = useLazyGetPlaylistRelatedTracksQuery()
    const { triggerLoadPlaylist } = useLoadPlaylist()

	const onQueuePlaylist = (playlist: Playlist, tracksData: Array<Track>) => {
		if (playlist && tracksData && tracksData.length){
			if (queuedTracks.length === 0){
				triggerLoadPlaylist(playlist, tracksData, true)
			}
			else {
				const queueItems = prepareQueueItems(tracksData)
				dispatch(setQueuedTracks([...queuedTracks, ...queueItems]))
				if (!showAudioPlayer){
					dispatch(setShowAudioPlayer(true))
				}
				if (!showQueuedTrackList){
					dispatch(setShowQueuedTrackList(true))
				}
				dispatch(setIsLoading(false))
			}
		}
	}

    const triggerQueuePlaylist = (playlistParam: Playlist, tracksParam: Array<Track>) => {
		onQueuePlaylist(playlistParam, tracksParam)
	}

	return {
		triggerQueuePlaylist
	}
}

