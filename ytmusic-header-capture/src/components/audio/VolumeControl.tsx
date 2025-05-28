import React, { ChangeEvent, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"
import { IconVolumeOff } from "../../icons/IconVolumeOff"
import { IconVolumeLow } from "../../icons/IconVolumeLow"
import { IconVolumeHigh } from "../../icons/IconVolumeHigh"
import { useAudioPlayerContext } from "../../context/AudioPlayerProvider"
import { setVolume, setMuted } from "../../slices/audioPlayerSlice"

export const VolumeControl = () => {
	const { audioRef } = useAudioPlayerContext()
	const dispatch = useAppDispatch()
	const { volume, muted } = useAppSelector((state) => state.audioPlayer)
	const convertedVolume = volume * 100

	useEffect(() => {
		chrome.runtime.sendMessage({
			type: "AUDIO_COMMAND",
			ensureOffscreenExists: true,
			payload: {
				action: "setVolume",
				volume: volume,
				muted: muted,
			}
		})
	}, [volume, muted])

	const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
		// store the volume in decimal form
		dispatch(setVolume(Number(e.target.value)/100))
	}

	return (
		<div>
			<div className="flex items-center gap-3">
				<button onClick={() => dispatch(setMuted(!muted))}>
					{muted || convertedVolume < 5 ? (
						<IconVolumeOff/>
					) : convertedVolume < 40 ? (
						<IconVolumeLow/>
					) : (
						<IconVolumeHigh/>
					)}
				</button>
				<input
					style={{
						background: `linear-gradient(to right, #f50 ${convertedVolume}%, #ccc ${convertedVolume}%)`,
					}}
					type="range"
					min={0}
					max={100}
					value={convertedVolume}
					className="volumn"
					onChange={handleVolumeChange}
				/>
			</div>
		</div>
	)
}

