import React, { useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { setTimeProgress } from "../../slices/audioPlayerSlice"
import { formatTime } from "../../helpers/functions"
import { useAudioPlayerContext } from "../../context/AudioPlayerProvider"

export const ProgressBar = () => {
	const { duration, timeProgress } = useAppSelector((state) => state.audioPlayer)
	const { progressBarRef, audioRef } = useAudioPlayerContext()
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (progressBarRef?.current){
			progressBarRef.current.max = duration.toString()	
		}
	}, [duration])

	/* 
		make sure that when the video is playing or paused,
		it will always set the progress bar range progress
		to the current time if the user clicks and changes
		the range
	*/
	const handleProgressBarChange = () => {
		if (audioRef?.current && progressBarRef?.current){
			const newTime = Number(progressBarRef.current.value)
			audioRef.current.currentTime = newTime
			dispatch(setTimeProgress(newTime))
			// if progress bar changes while audio is on pause
			progressBarRef.current.style.setProperty(
				"--range-progress",
				`${(newTime/duration) * 100}%`
			)
		}
	}

	return (
		<div className="flex items-center justify-center gap-5 w-full">
			<span className = "text-center truncate w-24">{formatTime(timeProgress)}</span>				
			<input 
				defaultValue="0"
				onChange={handleProgressBarChange} 
				ref={progressBarRef} 
				className="max-w-[80%] bg-gray-300" 
				type="range"/>
			<span className = "text-center truncate w-24">{formatTime(duration)}</span>
		</div>
	)
}

