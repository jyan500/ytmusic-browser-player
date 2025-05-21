import React from "react"
import { Playlist } from "../types/common"
import { PlaylistCardItem } from "./PlaylistCardItem"

interface Props {
	data: Array<Playlist>		
}

export const PlaylistGrid = ({data}: Props) => {
	return (
		<div className = "grid grid-cols-4 md:grid-cols-5 gap-2">
		{
			data?.map((item: Playlist) => (
				<PlaylistCardItem key={item.playlistId} playlist={item}/>
			))
		}
		</div>	
	)
}

