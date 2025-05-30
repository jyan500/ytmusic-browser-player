import React, { useCallback, useState, useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from '../../hooks/redux-hooks'
import { IconPlay } from "../../icons/IconPlay" 
import { IconFastForward } from "../../icons/IconFastForward" 
import { IconMenu } from "../../icons/IconMenu" 
import { IconPause } from "../../icons/IconPause" 
import { IconRepeat } from "../../icons/IconRepeat" 
import { IconRewind } from "../../icons/IconRewind" 
import { IconSkipEnd } from "../../icons/IconSkipEnd" 
import { IconSkipStart } from "../../icons/IconSkipStart" 
import { IconShuffle } from "../../icons/IconShuffle"
import {
	setTimeProgress,
	setDuration,
	setIndex,
	setIsLoading,
	setQueuedTracks,
	setCurrentTrack,
	setShuffledQueuedTracks,
	setSuggestedTracks,
	setIsShuffling,
	setStoredPlaybackInfo,
	setIsPlaying,

} from "../../slices/audioPlayerSlice"
import { setShowQueuedTrackList } from "../../slices/queuedTrackListSlice" 
import { useAudioPlayerContext } from "../../context/AudioPlayerProvider"
import { PlayButton } from "../PlayButton"
import { useLazyGetSongPlaybackQuery, useLazyGetRelatedTracksQuery } from "../../services/private/songs"
import { useLazyGetPlaylistRelatedTracksQuery } from "../../services/private/playlists"
import { Track } from "../../types/common"
import { formatTime, shuffle, randRange } from "../../helpers/functions"
import { v4 as uuidv4 } from "uuid"
import { usePrevious } from "../../hooks/usePrevious"

export const Controls = () => {
	const { 
		storedPlaybackInfo,  
		queuedTracks,
		index,
		timeProgress,
		suggestedTracks,
		currentTrack,
		isLoading,
		isAutoPlay,
		shuffledQueuedTracks,
		isShuffling,
		isPlaying,
		duration,
		volume,
		muted,
	} = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
	const { audioRef, progressBarRef } = useAudioPlayerContext()
	const dispatch = useAppDispatch()
	const playAnimationRef = useRef<number | null>(null)
	const [isRepeat, setIsRepeat] = useState<boolean>(false)
    const [trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();
    const [ triggerRelatedTracks, {data: relatedTracksData, error: relatedTracksError, isFetching: isRelatedTracksFetching}] = useLazyGetRelatedTracksQuery()

    const playbackURL = storedPlaybackInfo ? storedPlaybackInfo.playbackURL : ""
    const previousPlaybackURL = usePrevious<string>(playbackURL)

    /* Unused */
	// const skipForward = () => {
	// 	if (audioRef.current){
	// 		audioRef.current.currentTime += 15
	// 		updateProgress()
	// 	}
	// }

	// const skipBackward = () => {
	// 	if (audioRef.current){
	// 		audioRef.current.currentTime -= 15
	// 		updateProgress()
	// 	}	
	// }

	const handlePrevious = useCallback(() => {
		let queued = isShuffling ? shuffledQueuedTracks : queuedTracks
		if (queued?.length && index - 1 >= 0){
			dispatch(setIndex(index-1))	
			const track = queued[index-1]
	        dispatch(setCurrentTrack(track))
	        setPlayback(track)
	        dispatch(setIsLoading(true))
		}
	}, [currentTrack, queuedTracks, shuffledQueuedTracks, index])

	const handleNext = useCallback(() => {
		let queued = isShuffling ? shuffledQueuedTracks : queuedTracks
		if (queued?.length){
			if (index + 1 < queued.length){
				dispatch(setIndex(index+1))
				const track = queued[index+1]
		        dispatch(setCurrentTrack(track))
		        setPlayback(track)
		        dispatch(setIsLoading(true))
		    }
		}
	}, [currentTrack, queuedTracks, shuffledQueuedTracks, suggestedTracks, isAutoPlay, index])

	const setPlayback = (track: Track) => {
		// set to true to use the cached result if available
		trigger(track.videoId, true)
	}

	/* Handle animation for the progress bar once the audio playback begins */
	const updateProgress = useCallback(() => {
		const listener = (message: any, sender: any, sendResponse: any) => {
			if (message.type === "AUDIO_PROGRESS" && isPlaying){
				const currentTime = message.payload.currentTime
				dispatch(setTimeProgress(currentTime))
				if (progressBarRef?.current){
					progressBarRef.current.value = currentTime.toString()
					progressBarRef.current.style.setProperty(
						"--range-progress",
						`${(currentTime/duration) * 100}%`
					)
				}
			}
		}
		chrome.runtime.onMessage.addListener(listener)
		return () => chrome.runtime.onMessage.removeListener(listener)
	}, [isPlaying, duration, timeProgress, progressBarRef])

	const startAnimation = useCallback(() => {
		if (progressBarRef.current && duration){
			const animate = () => {
				updateProgress()
				playAnimationRef.current = requestAnimationFrame(animate)
			}
			playAnimationRef.current = requestAnimationFrame(animate)
		}
	}, [isPlaying, updateProgress, duration, progressBarRef])

	useEffect(() => {
		// if we went from not playing to playing, or we're switching tracks, play audio
		if (isPlaying){
			// send command to play audio and start progress bar animation
			chrome.runtime.sendMessage({
				type: "AUDIO_COMMAND",
				ensureOffscreenExists: true,
				payload: {
					action: "play",	
					url: playbackURL,
					// if we're restarting the same song, send the time progress.
					// otherwise, reset the time progress to 0 if we're switching songs
					currentTime: previousPlaybackURL !== playbackURL ? 0 : timeProgress,
					volume: volume,
					muted: muted,
				}
			})
		}
		// if went from playing to not playing, pause audio
		else {
			// send command to pause audio and pause progress bar animation
			chrome.runtime.sendMessage({
				type: "AUDIO_COMMAND",
				ensureOffscreenExists: true,
				payload: {
					action: "pause",
				}
			})
		}
		// return callback to clean up and cancel animation frame
		return () => {
			if (playAnimationRef.current != null){
				cancelAnimationFrame(playAnimationRef.current)
			}
		}
	}, [isPlaying, previousPlaybackURL, playbackURL])

	useEffect(() => {
		if (isPlaying && duration){
			playAnimationRef.current == null ? startAnimation() : updateProgress()
		}
		else {
			if (playAnimationRef.current != null){
				cancelAnimationFrame(playAnimationRef.current)
				playAnimationRef.current = null
			}
			updateProgress()
		}
		return () => {
			if (playAnimationRef.current != null){
				cancelAnimationFrame(playAnimationRef.current)
			}
		}
	}, [isPlaying, startAnimation, updateProgress])

	useEffect(() => {
		const listener = (message: any, sender: any, sendResponse: any) => {
			if (message.type === "AUDIO_ENDED"){
				if (isRepeat){
					chrome.runtime.sendMessage({
						type: "AUDIO_COMMAND",
						ensureOffscreenExists: true,
						payload: {
							action: "restart",
							url: playbackURL,
							currentTime: 0
						}
					})
				}	
				else {
					handleNext()
				}
			}
			sendResponse({success: true})
			return true
		}
		chrome.runtime.onMessage.addListener(listener)
		return () => chrome.runtime.onMessage.removeListener(listener);
	}, [isRepeat, handleNext])

	// if the playlist is about to end, load in the suggested songs into the queue if autoplay is on
	useEffect(() => {
		if (index + 1 === queuedTracks?.length && isAutoPlay && currentTrack){
			if (suggestedTracks?.length > 0){
				// while the current track is the same as the top, use the next one
				let suggestion = {} as Track
				let suggestedIndex = 0 
				for (let i = 0; i < suggestedTracks.length; ++i){
					if (suggestedTracks[i].videoId !== currentTrack.videoId){
						suggestion = suggestedTracks[i]
						suggestedIndex = i
						break
					}
				}
				// add the suggested track onto the queue, including the queue id
				dispatch(setQueuedTracks([...queuedTracks, {
					queueId: uuidv4(),
					...suggestion
				}]))
				// remove the suggestion from suggested tracks
				const removedSuggestions = [...suggestedTracks]
				removedSuggestions.splice(suggestedIndex, 1)
				dispatch(setSuggestedTracks(removedSuggestions))
			}
			else {
				// load more suggestions (if there's a playlist playing, pass it in)
				// use a random video id from the queued tracks to pass in for variance on the suggestions
				const randIndex = randRange(0, queuedTracks.length-1) 
				triggerRelatedTracks(queuedTracks[randIndex].videoId)
			}
		}

	}, [index, currentTrack, queuedTracks, isAutoPlay, suggestedTracks])

	useEffect(() => {
		const listener = (message: any, sender: any, sendResponse: any) => {
			if (message.type === "AUDIO_LOADED"){
				const seconds = message.payload.duration
				if (seconds !== undefined){
					dispatch(setIsLoading(false))
					dispatch(setDuration(seconds))
					if (progressBarRef?.current){
						progressBarRef.current.max = seconds.toString()
					}
				}
			}

			sendResponse({success: true})
			return true
		}

		chrome.runtime.onMessage.addListener(listener)
		return () => chrome.runtime.onMessage.removeListener(listener);
	}, [])

	/* Set the playback information once the song data is finished loading */
	useEffect(() => {
        if (!isFetching && songData){
            dispatch(setStoredPlaybackInfo(songData))
        	dispatch(setIsPlaying(true))
        }
    }, [songData, isFetching])

    useEffect(() => {
    	if (!isRelatedTracksFetching && relatedTracksData){
    		dispatch(setSuggestedTracks(relatedTracksData))		
    	}
    }, [relatedTracksData, isRelatedTracksFetching])

	const handleOnShuffle = () => {
		if (currentTrack){
			// create shuffled queued tracks by randomly ordering the queued tracks
			if (!isShuffling){
				// make sure in the shuffled version, we don't include the current track 
				let shuffledTracks = shuffle(queuedTracks.filter((track) => track.videoId !== currentTrack?.videoId))
				// start the index back at 0, since the first element in the shuffled track
				// should be the current track
				dispatch(setIndex(0))
				dispatch(setShuffledQueuedTracks([currentTrack, ...shuffledTracks]))
				dispatch(setIsShuffling(true))
			}
			else {
				// get the track index of the current song in the original order
				const currentTrackIndex = queuedTracks.indexOf(currentTrack)
				dispatch(setIndex(currentTrackIndex))
				dispatch(setIsShuffling(false))
			}
		}
		if (!showQueuedTrackList){
			dispatch(setShowQueuedTrackList(true))
		}
	}

	return (
		<div className = "flex gap-4 items-center">
			{/* <audio autoPlay onLoadedMetadata={onLoadedMetadata} ref={audioRef} src={playbackURL}/> */}
			<button onClick={handlePrevious}>
				<IconSkipStart/>
			</button>
			{/*<button onClick={skipBackward}>
				<IconRewind/>
			</button>*/}
			<PlayButton isPlaying={isPlaying} iconWidthHeight={"w-4"} width={"w-8"} height={"h-8"} onClick={() => dispatch(setIsPlaying(!isPlaying))}/>
			{/*	<button onClick={skipForward}>
				<IconFastForward/>
			</button>*/}
			<button onClick={handleNext}>
				<IconSkipEnd/>
			</button>
			<div className = "w-20">
				<span className = "text-center truncate">{formatTime(timeProgress)}/{formatTime(duration)}</span>
			</div>
			<button onClick={handleOnShuffle}>
				<IconShuffle className={isShuffling ? "text-orange" : ""}/>
			</button>
			<button onClick={()=> {
				setIsRepeat((prev) => !prev)
			}}>
				<IconRepeat className={isRepeat ? "text-orange": ""}/>
			</button>
		</div>
	)
}

