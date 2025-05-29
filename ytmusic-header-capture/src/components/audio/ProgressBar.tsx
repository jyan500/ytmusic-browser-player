import React, { useEffect, useState, useRef, useCallback } from "react"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { useDebouncedCallback } from "../../hooks/useDebouncedCallback"
import { setTimeProgress, setIsPlaying } from "../../slices/audioPlayerSlice"
import { formatTime } from "../../helpers/functions"
import { useAudioPlayerContext } from "../../context/AudioPlayerProvider"

export const ProgressBar = () => {
	const { queuedTracks, volume, muted, duration, isPlaying, timeProgress, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const { progressBarRef, audioRef } = useAudioPlayerContext()
	const dispatch = useAppDispatch()
	const [hoverValue, setHoverValue] = useState<number|null>(null)
	const [tooltipPos, setTooltipPos] = useState<number>(0)
	const tooltipRef = useRef<HTMLDivElement>(null)

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
	const handleProgressBarChange = useCallback(() => {
		if (progressBarRef?.current){
			const newTime = Number(progressBarRef?.current.value)	
			dispatch(setTimeProgress(newTime))	
			progressBarRef?.current?.style.setProperty(
				"--range-progress",
				`${(newTime/duration) * 100}%`
			)	
			chrome.runtime.sendMessage({
				type: "AUDIO_COMMAND",
				ensureOffscreenExists: true,
				payload: {
					action: "setTime",
					currentTime: newTime
				}
			}, () => {
				
			})
		}
	}, [duration, progressBarRef])

	const handleMouseMove = useCallback((e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
		if (progressBarRef?.current && tooltipRef?.current){
			const input = progressBarRef.current
			// get the "length" of the range input
			const rect = input.getBoundingClientRect()
			/* 
			Visually, it's roughly half of the tooltip's width that we have to account for.

			this:

            [tooltip]                  [tooltip]
			------------------------------------
			^^^^							^^^^
			mouse cursor		    mouse cursor

			instead of this:

		[tooltip]                  			[tooltip]
			------------------------------------
			^^^^							^^^^
			mouse cursor		    mouse cursor

			this prevents the tooltip from displaying underneath of the window
			if it gets too close to the sides.

			*/
			 
			const tooltipBoundary = tooltipRef?.current.getBoundingClientRect().width/2
			const min = Number(input.min)
			const max = Number(input.max)

			// calculates the horizontal offset from the left edge of the input
			const offsetX = e.clientX - rect.left
			// calculate percent that the mouse position is at
			// in relation to the input length
			const percent = Math.min(Math.max(offsetX/rect.width, 0), 1)
			// get the time value in seconds that's proportional
			// to the length of the progress bar 
			const value = min + percent * (max - min)

			setHoverValue(value)
			// the additional logic here
			// is to prevent the tooltip from going underneath the window by setting
			// the mouse position to be X amount of pixels away from each boundary once it
			// gets too close
			if (offsetX <= tooltipBoundary) {
				setTooltipPos(tooltipBoundary)
			}
			else if (offsetX >= (rect.right - tooltipBoundary)){
				setTooltipPos(rect.right - tooltipBoundary)	
			}
			else {
				setTooltipPos(offsetX)
			}
		}
	}, [tooltipRef, setTooltipPos, setHoverValue])

	const handleMouseLeave = () => {
		setHoverValue(null)
	}

	const debouncedPlay = useDebouncedCallback(() => {
		dispatch(setIsPlaying(true))
	}, 150)

	const handleMouseDown = useCallback(() => {
		dispatch(setIsPlaying(false))
	}, [isPlaying])

	const handleMouseUp = useCallback(() => {
		debouncedPlay()
	}, [debouncedPlay])

	return (
		<div className={`${queuedTracks?.length > 0 ? "visible" : "invisible"} relative flex items-center justify-center w-full`}>
			{
				<div 
					ref={tooltipRef}
					className={`${hoverValue != null ? "visible" : "invisible"} absolute bottom-full mb-2 px-1 py-0.5 text-xs text-white bg-dark rounded shadow-sm pointer-events-none transition-opacity`}
					style={{left: tooltipPos, transform: "translateX(-50%)"}}
				>	
					{hoverValue ? formatTime(hoverValue) : "00:00"}
				</div>
			}
			<input 
				defaultValue="0"
				onChange={handleProgressBarChange} 
				ref={progressBarRef} 
				className="bg-gray-300" 
				onMouseDown={handleMouseDown}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
				type="range"/>
		</div>
	)
}

