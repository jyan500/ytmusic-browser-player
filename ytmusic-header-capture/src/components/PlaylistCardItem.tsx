import React from "react"
import { goTo } from "react-chrome-extension-router"
import { Thumbnail, Playlist as TPlaylist } from "../types/common"
import { Playlist } from "../pages/Playlist"

interface Props {
	playlist: TPlaylist | undefined
	imageHeight?: string
	children?: React.ReactNode
	isHeader?: boolean
}

interface PlaylistWrapperProps {
	playlist?: TPlaylist | undefined
	children: React.ReactNode
}

const HeaderPlaylistCardItem = ({children}: PlaylistWrapperProps) => {
	return (
		<div className = "flex flex-col gap-y-2">
			{children}
		</div>
	)
}

const GridPlaylistCardItem = ({playlist, children}: PlaylistWrapperProps) => {
	return (
		<button className = "flex flex-col gap-y-2" onClick={() => goTo(Playlist, {playlist})}>
			{children}
		</button>	
	)
}

interface CardContentProps {
	playlist: TPlaylist | undefined
	thumbnail: Thumbnail | undefined
	children: React.ReactNode
	isHeader?: boolean
	imageHeight?: string
}

const CardContent = ({imageHeight, isHeader, playlist, thumbnail, children}: CardContentProps) => {
	return (
		<>
			<div className={`${isHeader ? "items-center" : "items-start"} flex flex-col gap-y-2`}>
				<img loading="lazy" className={`${imageHeight ?? "h-32"} object-fill`} src = {thumbnail?.url}/>
				<div className = {`${isHeader ? "text-center text-lg" : "text-left"} break-words`}>
					<p className = {`${isHeader ? "text-md" : ""} font-semibold`}>{playlist?.title}</p>
					<p>{playlist?.description}</p>
				</div>
			</div>
			{children}	
		</>
	)
}

export const PlaylistCardItem = ({playlist, imageHeight, children, isHeader}: Props) => {
	// find the largest thumbnail and compress to fit 
	const widths = playlist?.thumbnails?.map((thumbnail) => thumbnail.width) ?? []
	const biggestWidth = Math.max(...widths)
	const thumbnail = playlist?.thumbnails?.find((thumbnail) => thumbnail.width === biggestWidth)
	return (
		isHeader ? 
		<HeaderPlaylistCardItem>
			<CardContent 
				imageHeight={imageHeight} 
				playlist={playlist} 
				thumbnail={thumbnail} 
				isHeader={isHeader}
			>
				{children}
			</CardContent>
		</HeaderPlaylistCardItem> : 
		<GridPlaylistCardItem playlist={playlist}>
			<CardContent 
				imageHeight={imageHeight} 
				playlist={playlist} 
				thumbnail={thumbnail} 
				isHeader={isHeader}
			>
				{children}
			</CardContent>
		</GridPlaylistCardItem>
	)
}
