import React from "react"
import { Playlist as PlaylistType } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"

interface Props {
	playlistId: string 
}

export const Playlist = ({playlistId}: Props) => {
	return (
		<div>
			<NavButton onClick={(e) => {goTo(Playlists)}} message={"Go Back"}/>
			<p>{playlistId}</p>
		</div>
	)
}