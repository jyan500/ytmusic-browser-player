import React, { useState } from "react"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { IconMenu } from "../../icons/IconMenu"
import { TrackInfo } from "./TrackInfo"
import { TrackImage } from "./TrackImage"
import { Controls } from "./Controls"
import { ProgressBar } from "./ProgressBar"
import { VolumeControl } from "./VolumeControl"
import { Playlist } from "./Playlist"

export const AudioPlayer = () => {
	const [openDrawer, setOpenDrawer] = useState(false)
	const { currentTrack } = useAppSelector((state) => state.audioPlayer)
	return (
		<div className = "w-full fixed bottom-0">
			<ProgressBar/>
			<div className = "flex flex-row gap-4 items-center text-white p-[0.5rem_10px] min-h-8 bg-dark">
				<div className = "w-3/8">
					<TrackInfo track={currentTrack}/>
				</div>
				<div className = "w-5/8 flex flex-row items-center gap-2 m-auto">
					<Controls/>
					<div className = "w-28">
						<VolumeControl/>
					</div>
				</div>
			</div>
		</div>	
	)
}
