import React from "react"
import { useAppSelector, useAppDispatch } from '../../hooks/redux-hooks'

export const Controls = () => {
	const { storedPlaybackInfo  } = useAppSelector((state) => state.audioPlayer)
	return (
		<div>
			<audio src={storedPlaybackInfo.length ? storedPlaybackInfo[0].playbackURL : ""} controls/>	
		</div>
	)
}

