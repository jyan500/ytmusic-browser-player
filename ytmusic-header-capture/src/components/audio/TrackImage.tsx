import React from "react"
import { Track } from "../../types/common"
import { useAppSelector } from "../../hooks/redux-hooks"
import { IconMusicNote } from "../../icons/IconMusicNote"
import { getThumbnailUrl } from "../../helpers/functions"
import { LoadingSpinner } from "../elements/LoadingSpinner"

interface Props {
	track: Track | null | undefined
}

export const TrackImage = ({track}: Props) => {
	const { isLoading } = useAppSelector((state) => state.audioPlayer)
	return (
		<>	
			{
				track?.thumbnails ? (
					<div className = "w-full h-full relative group">
						<img alt={"audio avatar"} className = "w-full h-full object-fill" src={getThumbnailUrl(track)} />
						<div className = {`${isLoading ? "visible": "invisible"} absolute flex justify-center items-center inset-0 bg-black/50`}>
							<LoadingSpinner/>	
						</div>
					</div>
				) : 
				<div className = "flex items-center justify-center w-full h-full">
					<span className="text-xl text-gray-600">
						<IconMusicNote/>
					</span>
				</div>
			}
		</>
	)
}

