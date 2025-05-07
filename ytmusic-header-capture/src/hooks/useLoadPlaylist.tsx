import React, { useState, useEffect } from "react"
import { Playlist, Track } from "../types/common"
import { useAppDispatch, useAppSelector } from "./redux-hooks"
import { setSuggestedTracks, setIndex, setIsLoading, setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setShowAudioPlayer } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { prepareQueueItems, randRange } from "../helpers/functions"

export const useLoadPlaylist = (playlist: Playlist) => {
	const dispatch = useAppDispatch()	
	const { showAudioPlayer, suggestedTracks, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ triggerGetPlayback, { data: songData, error: songError, isFetching: isFetchingSong } ] = useLazyGetSongPlaybackQuery()
    const [ triggerRelatedTracks, {data: relatedTracksData, error: relatedTracksError, isFetching: isRelatedTracksFetching}] = useLazyGetPlaylistRelatedTracksQuery()

	const onQueuePlaylist = (tracksData: Array<Track>) => {
		/* 
			1) put all tracks onto the queue
			2) set the current track
				- request the playback URL for this track
				if it's not already found	
			3) set the audio player to isPlaying
		*/
		if (playlist){
			if (tracksData && tracksData.length){
				const queueItems = prepareQueueItems(tracksData)
				const top = queueItems[0]
				dispatch(setIsLoading(true))
				dispatch(setCurrentTrack(top))
				dispatch(setQueuedTracks(queueItems))
	            triggerGetPlayback(top.videoId)
	            const randIndex = randRange(0, queueItems.length-1)
	            triggerRelatedTracks({playlistId: playlist.playlistId, videoId: queueItems[randIndex].videoId})
			}
			dispatch(setPlaylist(playlist))
			if (!showAudioPlayer){
				dispatch(setShowAudioPlayer(true))
			}
			if (!showQueuedTrackList){
				dispatch(setShowQueuedTrackList(true))
			}
		}
	}

    useEffect(() => {
    	if (!isFetchingSong && songData){
            dispatch(setStoredPlaybackInfo(songData))
            dispatch(setIsLoading(false))
            dispatch(setIsPlaying(true))
        }
    }, [songData, isFetchingSong])

    useEffect(() => {
    	if (!isRelatedTracksFetching && relatedTracksData){
    		dispatch(setSuggestedTracks(relatedTracksData))
    	}
    }, [relatedTracksData, isRelatedTracksFetching])


    const triggerLoadPlaylist = (tracksData: Array<Track>) => {
		onQueuePlaylist(tracksData)
	}

	return {
		triggerLoadPlaylist
	}
}

