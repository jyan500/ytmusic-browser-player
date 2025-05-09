import React, { useState, useEffect } from "react"
import { Playlist, Track } from "../types/common"
import { useAppDispatch, useAppSelector } from "./redux-hooks"
import { setSuggestedTracks, setIndex, setIsLoading, setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setShowAudioPlayer } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist as setCurrentPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { prepareQueueItems, randRange } from "../helpers/functions"

/* 
	Exposes a "triggerLoadTrack" function that takes in track data, and 
	loads in song data and related songs for the track. It also takes in the playlist
	to determine whether the song that's currently playing is from the playlist or not.
*/

export const useLoadTrack = () => {
	const dispatch = useAppDispatch()
	const { showAudioPlayer, suggestedTracks, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();
	
	useEffect(() => {
        if (!isFetching && songData){
            dispatch(setIsLoading(false))
            dispatch(setIsPlaying(true))
            dispatch(setStoredPlaybackInfo(songData))
        }
    }, [songData, isFetching])

    const search = (videoId: string) => {
        // if we're inside the queued tracklist, use the cached results
        // otherwise, reload the song in case the cache results expire
        // on youtube's end
        trigger(videoId, showQueuedTrackList)
    }

    const onPress = (track: Track, playlist: Playlist | undefined) => {
        if (currentTrack?.videoId === track.videoId){
            dispatch(setIsPlaying(!isPlaying))
        }
        else {
            dispatch(setIsLoading(true))
            const queuedTrack = queuedTracks.find((qTrack) => qTrack.videoId === track.videoId)
            if (!queuedTrack){
                // place one item on the queue
                if (playlist){
                    // if we're in playlist, but its not the current playlist that's playing, 
                    // also clear out the suggestions, this will trigger the Controls component
                    // to automatically find new suggestions
                    if (playlist.playlistId !== currentPlaylist?.playlistId){
                        dispatch(setSuggestedTracks([]))
                    }
                    dispatch(setCurrentPlaylist(playlist))
                }
                const queueItems = prepareQueueItems([track])
                dispatch(setQueuedTracks(queueItems))
                dispatch(setCurrentTrack(queueItems[0]))
                dispatch(setIndex(0))
            }
            // if there are queued tracks and we're playing a song in the queue
            // set the index to this track
            else {
                const index = queuedTracks.indexOf(queuedTrack)
                dispatch(setIndex(index))
                dispatch(setCurrentTrack(queuedTracks[index]))
            }
            if (!showAudioPlayer){
                dispatch(setShowAudioPlayer(true))
            }
            search(track.videoId)
        }
    }

    const triggerLoadTrack = (playlist: Playlist | undefined, trackParam: Track) => {
		onPress(trackParam, playlist)
	}

	return {
		triggerLoadTrack
	}
}

