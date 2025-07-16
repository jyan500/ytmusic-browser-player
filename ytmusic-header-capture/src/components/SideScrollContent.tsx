import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { SuggestedContent, OptionType, Playlist as TPlaylist, Track, Thumbnail } from "../types/common"
import { PlayableCard } from "./PlayableCard"
import { goTo } from "react-chrome-extension-router"
import { useLazyGetWatchPlaylistQuery, useLazyGetPlaylistTracksQuery } from "../services/private/playlists"
import { useLazyGetRelatedTracksQuery } from "../services/private/songs"
import { useLoadTrack } from "../hooks/useLoadTrack"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { Playlist } from "../pages/Playlist"
import { Artist } from "../pages/Artist"
import { Album } from "../pages/Album"
import { getThumbnail } from "../helpers/functions"
import { v4 as uuidv4 } from "uuid"

interface Props {
	title: string
	thumbnail: Thumbnail | undefined
	canPlay: boolean
	id: string 
	description: string
	cardClickAction: () => void
	playContent: () => void
	linkableDescription?: React.ReactNode
	showVerticalMenu?: () => React.ReactNode
	displayDropdown?: () => React.ReactNode
	showPauseButton: boolean
	isCircular?: boolean
}

export const SideScrollContent = ({
	title, 
	thumbnail, 
	canPlay,
	description, 
	id, 
	cardClickAction,
	linkableDescription,
	playContent,
	showVerticalMenu,
	displayDropdown,
	isCircular=false,
	showPauseButton,
}: Props) => {
	return (
		<div className = "flex flex-col gap-y-2 relative">
			<PlayableCard 
				imageHeight={"h-32"}
				imageWidth={"w-32"}
				title={title}
				thumbnail={thumbnail}
				description={description}
				isCircular={isCircular}
				isHeader={false}
				canPlay={canPlay}
				cardOnClick={cardClickAction}
				linkableDescription={linkableDescription}
				imagePlayButtonProps={canPlay ? {
					id:id,
					onPress: playContent,
					imageHeight: "h-32", 
				    imageWidth: "w-32",
				    playButtonWidth: "w-6", 
				    playButtonHeight: "h-6",
				    imageURL: thumbnail?.url ?? "", 
				    showVerticalMenu: showVerticalMenu,
				    showPauseButton: showPauseButton,
				} : undefined}
			>
			</PlayableCard>
			{displayDropdown ? displayDropdown() : null}
		</div>
	)
}
