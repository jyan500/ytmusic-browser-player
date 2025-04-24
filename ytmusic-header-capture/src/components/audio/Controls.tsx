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
} from "../../slices/audioPlayerSlice"
import { useAudioPlayerContext } from "../../context/AudioPlayerProvider"

export const Controls = () => {
	const { 
		storedPlaybackInfo,  
		timeProgress,
		duration
	} = useAppSelector((state) => state.audioPlayer)
	const { audioRef, progressBarRef } = useAudioPlayerContext()
	const dispatch = useAppDispatch()
	const playAnimationRef = useRef<number | null>(null)
	const [isShuffle, setIsShuffle] = useState<boolean>(false)
	const [isRepeat, setIsRepeat] = useState<boolean>(false)
	const [isPlaying, setIsPlaying] = useState<boolean>(false)

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
		if (audioRef?.current){
			audioRef.current.volume = 0.3
		}
	}, [])

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
			<button onClick={()=> {}}>
				<IconSkipStart/>
			</button>
			<button onClick={()=> {}}>
				<IconRewind/>
			</button>
			<button onClick={()=>{
				setIsPlaying((prev) => !prev)
			}}>
				{isPlaying ? <IconPause/> : <IconPlay/>}
			</button>
			<button onClick={()=> {}}>
				<IconFastForward/>
			</button>
			<button onClick={()=> {}}>
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

