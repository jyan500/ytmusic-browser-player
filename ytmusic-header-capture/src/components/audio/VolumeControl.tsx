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

	useEffect(() => {
		chrome.runtime.sendMessage({
			type: "AUDIO_COMMAND",
			ensureOffscreenExists: true,
			payload: {
				action: "setVolume",
				volume: volume/100,
				muted: muted,
			}
		})
	}, [volume, muted])

	const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch(setVolume(Number(e.target.value)))
	}

	return (
		<div>
			<div className="flex items-center gap-3">
				<button onClick={() => dispatch(setMuted(!muted))}>
					{muted || volume < 5 ? (
						<IconVolumeOff/>
					) : volume < 40 ? (
						<IconVolumeLow/>
					) : (
						<IconVolumeHigh/>
					)}
				</button>
				<input
					style={{
						background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
					}}
					type="range"
					min={0}
					max={100}
					value={volume}
					className="volumn"
					onChange={handleVolumeChange}
				/>
			</div>
		</div>
	)
}

