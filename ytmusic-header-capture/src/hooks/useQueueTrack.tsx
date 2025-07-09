import React, { useState, useEffect } from "react"
import { Playlist, Track } from "../types/common"
import { useAppDispatch, useAppSelector } from "./redux-hooks"
import { setSuggestedTracks, setIndex, setIsLoading, setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setShowAudioPlayer } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist as setCurrentPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { prepareQueueItems, randRange } from "../helpers/functions"
import { useLoadTrack } from "./useLoadTrack"

/* 
	Exposes a "triggerQueueTrack" function that takes in track data, and 
	adds track to queue. If there are no items on the queue, it will call "triggerLoadTrack"
    to load the playback.
*/

export const useQueueTrack = () => {
	const dispatch = useAppDispatch()
	const { showAudioPlayer, suggestedTracks, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const { triggerLoadTrack } = useLoadTrack()

    const onPress = (track: Track, playlist: Playlist | undefined) => {
        if (queuedTracks.length === 0){
            triggerLoadTrack(playlist, track)
        }
        else {
            const queueItems = prepareQueueItems([track])
            dispatch(setQueuedTracks([...queuedTracks, ...queueItems]))
            if (!showAudioPlayer){
                dispatch(setShowAudioPlayer(true))
            }
            if (!showQueuedTrackList){
                dispatch(setShowQueuedTrackList(true))
            }
        }
    }

    const triggerQueueTrack = (playlist: Playlist | undefined, trackParam: Track) => {
		onPress(trackParam, playlist)
	}

	return {
		triggerQueueTrack
	}
}

