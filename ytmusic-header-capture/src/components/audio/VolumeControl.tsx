import React, { ChangeEvent, useEffect, useState } from "react"
import { IconVolumeOff } from "../../icons/IconVolumeOff"
import { IconVolumeLow } from "../../icons/IconVolumeLow"
import { IconVolumeHigh } from "../../icons/IconVolumeHigh"
import { useAudioPlayerContext } from "../../context/AudioPlayerProvider"

export const VolumeControl = () => {
	const { audioRef } = useAudioPlayerContext()
	const [volume, setVolume] = useState<number>(60)
	const [muteVolume, setMuteVolume] = useState(false)

	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume/100
			audioRef.current.muted = muteVolume
		}
	}, [volume, audioRef, muteVolume])

	const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
		setVolume(Number(e.target.value))
	}

	return (
		<div>
			<div className="flex items-center gap-3">
				<button onClick={() => setMuteVolume(prev => !prev)}>
					{muteVolume || volume < 5 ? (
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

