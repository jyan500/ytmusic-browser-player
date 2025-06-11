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

interface Props {
	title: string
	thumbnail: Thumbnail | undefined
	canPlay: boolean
	description: string
	cardClickAction: () => void
	playContent: () => void
	linkableDescription?: React.ReactNode
	showPauseButton: boolean
	isCircular?: boolean
}

export const SideScrollContent = ({
	title, 
	thumbnail, 
	canPlay,
	description, 
	cardClickAction,
	linkableDescription,
	playContent,
	isCircular=false,
	showPauseButton,
}: Props) => {
	return (
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
				onPress: playContent,
				imageHeight: "h-32", 
			    imageWidth: "w-32",
			    playButtonWidth: "w-6", 
			    playButtonHeight: "h-6",
			    imageURL: thumbnail?.url ?? "", 
			    showPauseButton: showPauseButton,
			} : undefined}
		>
		</PlayableCard>
	)
}
