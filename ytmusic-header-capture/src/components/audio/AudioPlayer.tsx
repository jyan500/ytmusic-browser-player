import React, { useState } from "react"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"
import { IconMenu } from "../../icons/IconMenu"
import { TrackInfo } from "./TrackInfo"
import { Controls } from "./Controls"
import { ProgressBar } from "./ProgressBar"
import { VolumeControl } from "./VolumeControl"
import { Playlist } from "./Playlist"

export const AudioPlayer = () => {
	const [openDrawer, setOpenDrawer] = useState(false)
	return (
		<div className = "w-full fixed bottom-0">
			<div className = "flex flex-row gap-6 justify-between items-center text-white p-[0.5rem_10px] min-h-8 bg-dark">
				<TrackInfo/>
				<div className = "w-full flex flex-col items-center gap-1 m-auto flex-1">
					<Controls/>
					<ProgressBar/>
				</div>
				<div className = "flex items-center gap-2 text-gray-400 w-24">
					<VolumeControl/>
					{/*<button onClick={() => setOpenDrawer((prev) => !prev)}>
						<IconMenu/>
					</button>*/}
				</div>
			</div>
		</div>	
	)
}
