import React, { useEffect, useState, useRef } from "react"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { setTimeProgress } from "../../slices/audioPlayerSlice"
import { formatTime } from "../../helpers/functions"
import { useAudioPlayerContext } from "../../context/AudioPlayerProvider"

export const ProgressBar = () => {
	const { duration, timeProgress } = useAppSelector((state) => state.audioPlayer)
	const { progressBarRef, audioRef } = useAudioPlayerContext()
	const dispatch = useAppDispatch()
	const [hoverValue, setHoverValue] = useState<number|null>(null)
	const [tooltipPos, setTooltipPos] = useState<number>(0)

	useEffect(() => {
		if (progressBarRef?.current){
			progressBarRef.current.min = "0"
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

	const handleMouseMove = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		if (progressBarRef?.current){
			const input = progressBarRef.current
			// get the "length" of the range input
			const rect = input.getBoundingClientRect()
			const min = Number(input.min)
			const max = Number(input.max)

			// calculates the horizontal offset from the left edge of the input
			const offsetX = e.clientX - rect.left
			console.log("offsetX: ", offsetX)
			console.log("rect.right: ", rect.right)	
			// calculate percent that the mouse position is at
			// in relation to the input length
			const percent = Math.min(Math.max(offsetX/rect.width, 0), 1)
			// get the time value in seconds that's proportional
			// to the length of the progress bar 
			const value = min + percent * (max - min)

			setHoverValue(value)
			// 22 is an approximate size of the tooltip, the additional logic here
			// is to prevent the tooltip from going underneath the window by setting
			// the mouse position to be X amount of pixels away from each boundary once it
			// gets too close
			if (offsetX <= 22) {
				setTooltipPos(22)
			}
			else if (offsetX >= (rect.right - 22)){
				setTooltipPos(rect.right - 22)	
			}
			else {
				setTooltipPos(offsetX)
			}
		}
	}

	const handleMouseLeave = () => {
		setHoverValue(null)
	}

	return (
		<div className="relative flex items-center justify-center w-full">
			{
				hoverValue !== null ? (
					<div 
						className="absolute bottom-full mb-2 px-1 py-0.5 text-xs text-white bg-dark rounded shadow-sm pointer-events-none transition-opacity"
						style={{left: tooltipPos, transform: "translateX(-50%)"}}
					>	
						{formatTime(hoverValue)}
					</div>
				) : null 
			}
			<input 
				defaultValue="0"
				onChange={handleProgressBarChange} 
				ref={progressBarRef} 
				className="bg-gray-300" 
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				type="range"/>
		</div>
	)
}

