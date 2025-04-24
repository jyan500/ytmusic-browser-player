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
	setStoredPlaybackInfo,
	setIsPlaying,

} from "../../slices/audioPlayerSlice"
import { useAudioPlayerContext } from "../../context/AudioPlayerProvider"
import { useLazyGetSongPlaybackQuery } from "../../services/private/songs"
import { Track } from "../../types/common"

export const Controls = () => {
	const { 
		storedPlaybackInfo,  
		queuedTracks,
		index,
		timeProgress,
		isLoading,
		isPlaying,
		duration
	} = useAppSelector((state) => state.audioPlayer)
	const { audioRef, progressBarRef } = useAudioPlayerContext()
	const dispatch = useAppDispatch()
	const playAnimationRef = useRef<number | null>(null)
	const [isShuffle, setIsShuffle] = useState<boolean>(false)
	const [isRepeat, setIsRepeat] = useState<boolean>(false)
    const [trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();

	const skipForward = () => {
		if (audioRef.current){
			audioRef.current.currentTime += 15
			updateProgress()
		}
	}

	const skipBackward = () => {
		if (audioRef.current){
			audioRef.current.currentTime -= 15
			updateProgress()
		}	
	}

	const handlePrevious = useCallback(() => {
		if (queuedTracks?.length && index - 1 >= 0){
			dispatch(setIndex(index-1))	
			const track = queuedTracks[index-1]
	        dispatch(setCurrentTrack(track))
	        setPlayback(track)
		}
	}, [setCurrentTrack, setIndex])

	const handleNext = useCallback(() => {
		if (queuedTracks?.length && index + 1 < queuedTracks?.length){
			dispatch(setIndex(index+1))
			const track = queuedTracks[index+1]
	        dispatch(setCurrentTrack(track))
	        setPlayback(track)
		}
	}, [setCurrentTrack, setIndex])

	const setPlayback = (track: Track) => {
		const existingPlayback = getExistingPlayback(track.videoId)
		if (!existingPlayback){
			dispatch(setCurrentTrack(track))
		}
		else {
			trigger(track.videoId)
		}
	}

	const getExistingPlayback = (videoId: string) => {
		return storedPlaybackInfo.find((playback) => playback.videoId === videoId) != null
	}

	const updateProgress = useCallback(() => {
		if (audioRef.current && progressBarRef.current && duration){
			const currentTime = audioRef.current.currentTime
			dispatch(setTimeProgress(currentTime))
			progressBarRef.current.value = currentTime.toString()
			progressBarRef.current.style.setProperty(
				"--range-progress",
				`${(currentTime/duration) * 100}%`
			)
		}
	}, [duration, setTimeProgress, audioRef, progressBarRef])

	const startAnimation = useCallback(() => {
		if (audioRef.current && progressBarRef.current && duration){
			const animate = () => {
				updateProgress()
				playAnimationRef.current = requestAnimationFrame(animate)
			}
			playAnimationRef.current = requestAnimationFrame(animate)
		}
	}, [updateProgress, duration, audioRef, progressBarRef])

	useEffect(() => {
		if (audioRef?.current){
			if (isPlaying){
				audioRef.current.play()
				startAnimation()
			}
			else {
				audioRef.current.pause()
				if (playAnimationRef.current != null){
					cancelAnimationFrame(playAnimationRef.current)
					playAnimationRef.current = null
				}
				updateProgress()
			}
		}
		// return callback to clean up and cancel animation frame
		return () => {
			if (playAnimationRef.current != null){
				cancelAnimationFrame(playAnimationRef.current)
			}
		}
	}, [isPlaying, startAnimation, updateProgress, audioRef])

	useEffect(() => {
		const currentAudioRef = audioRef.current
		if (currentAudioRef){
			currentAudioRef.onended = () => {
				if (isRepeat){
					currentAudioRef.play()
				}	
				else {
					handleNext()
				}
			}	
		}
		return () => {
			if (currentAudioRef){
				currentAudioRef.onended = null
			}
		}
	}, [isRepeat, handleNext, audioRef])

	/* Set the playback information once the song data is finished loading */
	useEffect(() => {
        if (!isFetching && songData){
        	dispatch(setIsPlaying(false))
            dispatch(setStoredPlaybackInfo([...storedPlaybackInfo, songData]))
            dispatch(setIsLoading(false))
        }
    }, [songData, isFetching])

	const onLoadedMetadata = () => {
		if (audioRef?.current){
			const seconds = audioRef.current.duration
			if (seconds !== undefined){
				dispatch(setDuration(seconds))
				if (progressBarRef?.current){
					progressBarRef.current.max = seconds.toString()
				}
			}
		}
	}

	return (
		<div className = "flex gap-4 items-center">
			<audio onLoadedMetadata={onLoadedMetadata} ref={audioRef} src={storedPlaybackInfo.length ? storedPlaybackInfo[0].playbackURL : ""}/>	
			<button onClick={handlePrevious}>
				<IconSkipStart/>
			</button>
			<button onClick={skipBackward}>
				<IconRewind/>
			</button>
			<button onClick={()=>{
				dispatch(setIsPlaying(!isPlaying))
			}}>
				{isPlaying ? <IconPause/> : <IconPlay/>}
			</button>
			<button onClick={skipForward}>
				<IconFastForward/>
			</button>
			<button onClick={handleNext}>
				<IconSkipEnd/>
			</button>
			<button onClick={()=> {
				setIsShuffle((prev) => !prev)
			}}>
				<IconShuffle className={isShuffle ? "text-orange" : ""}/>
			</button>
			<button onClick={()=> {
				setIsRepeat((prev) => !prev)
			}}>
				<IconRepeat className={isRepeat ? "text-orange": ""}/>
			</button>
		</div>
	)
}

