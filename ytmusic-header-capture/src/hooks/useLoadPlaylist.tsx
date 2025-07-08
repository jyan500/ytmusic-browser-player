import React, { useState, useEffect } from "react"
import { Playlist, Track } from "../types/common"
import { useAppDispatch, useAppSelector } from "./redux-hooks"
import { setSuggestedTracks, setIndex, setIsLoading, setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setShowAudioPlayer } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist as setCurrentPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { prepareQueueItems, randRange } from "../helpers/functions"

/* 
	Exposes a "triggerLoadPlaylist" function that takes in tracks data, and queues
	up all tracks into queued tracks on the redux store. Also pulls playback for the first song
	on the queue, and pulls related track information
*/
export const useLoadPlaylist = () => {
	const dispatch = useAppDispatch()	
	const { showAudioPlayer, suggestedTracks, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ triggerGetPlayback, { data: songData, error: songError, isFetching: isFetchingSong } ] = useLazyGetSongPlaybackQuery()
    const [ triggerRelatedTracks, {data: relatedTracksData, error: relatedTracksError, isFetching: isRelatedTracksFetching}] = useLazyGetPlaylistRelatedTracksQuery()

	const onQueuePlaylist = (playlist: Playlist, tracksData: Array<Track>, getRelated=true, addToQueue=false) => {
		/* 
			1) put all tracks onto the queue
			2) if triggering playback, set the current track
				- request the playback URL for this track
				if it's not already found	
			3) set the audio player to isPlaying
		*/
		if (playlist){
			if (tracksData && tracksData.length){
				const queueItems = prepareQueueItems(tracksData)
				const top = queueItems[0]
				dispatch(setIsLoading(true))
				if (!addToQueue){
					dispatch(setCurrentTrack(top))
				}
				// if we're adding to queue, add the new queue items to the back of the existing queue items
				dispatch(setQueuedTracks(addToQueue ? [...queuedTracks, ...queueItems] : queueItems))
				if (!addToQueue){
		            triggerGetPlayback(top.videoId)
		            const randIndex = randRange(0, queueItems.length-1)
		            if (getRelated){
			            triggerRelatedTracks({playlistId: playlist.playlistId, videoId: queueItems[randIndex].videoId})
		            }
				}
				if (addToQueue){
					dispatch(setIsLoading(false))
				}
			}
			dispatch(setCurrentPlaylist(playlist))
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
            dispatch(setIsPlaying(true))
        }
    }, [songData, isFetchingSong])

    useEffect(() => {
    	if (!isRelatedTracksFetching && relatedTracksData){
    		dispatch(setSuggestedTracks(relatedTracksData))
    	}
    }, [relatedTracksData, isRelatedTracksFetching])


    const triggerLoadPlaylist = (playlistParam: Playlist, tracksParam: Array<Track>, getRelated=true, addToQueue=false) => {
		onQueuePlaylist(playlistParam, tracksParam, getRelated, addToQueue)
	}

	return {
		triggerLoadPlaylist
	}
}

