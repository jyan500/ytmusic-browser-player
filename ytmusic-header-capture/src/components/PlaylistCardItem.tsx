import React from "react"
import { goTo } from "react-chrome-extension-router"
import { Playlist as TPlaylist } from "../types/common"
import { Playlist } from "../pages/Playlist"

interface Props {
	playlist: TPlaylist | undefined
}

export const PlaylistCardItem = ({playlist}: Props) => {
	// find the largest thumbnail and compress to fit 
	const widths = playlist?.thumbnails?.map((thumbnail) => thumbnail.width) ?? []
	const biggestWidth = Math.max(...widths)
	const thumbnail = playlist?.thumbnails?.find((thumbnail) => thumbnail.width === biggestWidth)
	return (
		<button className = "flex flex-col" onClick={() => goTo(Playlist, {playlist})}>
			<div className="items-start flex flex-col gap-y-2">
				<img loading="lazy" className="h-32 object-fill" src = {thumbnail?.url}/>
				<div className = "text-left break-words">
					<p className = "font-semibold">{playlist?.title}</p>
					<p>{playlist?.description}</p>
				</div>
			</div>
		</button>
	)

}