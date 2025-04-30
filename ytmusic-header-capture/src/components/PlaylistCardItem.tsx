import React, {useState, useEffect} from "react"
import { goTo } from "react-chrome-extension-router"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { Thumbnail, Playlist as TPlaylist } from "../types/common"
import { Playlist } from "../pages/Playlist"
import { Props as ImagePlayButtonProps, ImagePlayButton } from "./ImagePlayButton"
import { setIsLoading, setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setShowAudioPlayer } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetPlaylistTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"

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
	canPlay?: boolean
	onPress?: () => void
	imagePlayButtonProps?: ImagePlayButtonProps
}

const CardContent = ({
	imageHeight, 
	isHeader, 
	playlist, 
	thumbnail, 
	canPlay, 
	imagePlayButtonProps,
	children
}: CardContentProps) => {
	const titleDescription = () => {
		return (
			<>
				<p className = {`${isHeader ? "text-md" : ""} font-semibold`}>{playlist?.title}</p>
				<p>{playlist?.description}</p>
			</>
		)
	}
	return (
		<>
			<div className={`${isHeader ? "items-center" : "items-start"} flex flex-col gap-y-2 group`}>
				{
					canPlay && imagePlayButtonProps ? 
					<ImagePlayButton
						imageHeight={"h-32"}
						imageWidth={"w-32"}
						playButtonWidth={"w-6"}
						playButtonHeight={"h-6"}
						onPress={imagePlayButtonProps?.onPress}
						imageURL={imagePlayButtonProps?.imageURL}
						showPlayButton={imagePlayButtonProps?.showPlayButton}

					/> :
					<img loading="lazy" className={`${imageHeight ?? "h-32"} object-fill`} src = {thumbnail?.url}/>
				}
				{
					isHeader ? 
					<div className = {`text-center text-lg break-words`}>
						{titleDescription()}
					</div> :
					<button onClick={() => goTo(Playlist, {playlist})} className = {`text-left break-words`}>
						{titleDescription()}
					</button>

				}
			</div>
			{children}	
		</>
	)
}

export const PlaylistCardItem = ({playlist, imageHeight, children, isHeader}: Props) => {
	// find the largest thumbnail and compress to fit 
	const dispatch = useAppDispatch()
	const { isPlaying, showAudioPlayer, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
	const widths = playlist?.thumbnails?.map((thumbnail) => thumbnail.width) ?? []
	const biggestWidth = Math.max(...widths)
	const thumbnail = playlist?.thumbnails?.find((thumbnail) => thumbnail.width === biggestWidth)
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const [ triggerGetPlayback, { data: songData, error: songError, isFetching: isFetchingSong } ] = useLazyGetSongPlaybackQuery()

	const onPressPlay = () => {
		// need to get all the tracks for the playlist first when the button is clicked
		if (playlist){
			triggerGetTracks({playlistId: playlist?.playlistId, params: {page: 1, perPage: 10}}, true)
		}
	}

	const onPause = () =>{
		dispatch(setIsPlaying(false))
	}

	const onQueuePlaylist = () => {
		/* 
			1) put all tracks onto the queue
			2) set the current track
				- request the playback URL for this track
				if it's not already found	
			3) set the audio player to isPlaying
		*/
		if (playlist){
			if (tracksData && tracksData.length){
				const top = tracksData[0]
				dispatch(setIsLoading(true))
				dispatch(setCurrentTrack(top))
				dispatch(setQueuedTracks(tracksData))
	            triggerGetPlayback(top.videoId)
			}
			dispatch(setPlaylist(playlist))
			if (!showAudioPlayer){
				dispatch(setShowAudioPlayer(true))
			}
			if (!showQueuedTrackList){
				dispatch(setShowQueuedTrackList(true))
			}
		}
	}

	useEffect(() => {
    	if (!isFetchingTracks && tracksData){
    		onQueuePlaylist()
    	}
    }, [isFetchingTracks, tracksData])

    useEffect(() => {
    	if (!isFetchingSong && songData){
            dispatch(setStoredPlaybackInfo(songData))
            dispatch(setIsLoading(false))
            dispatch(setIsPlaying(true))
        }
    }, [songData, isFetchingSong])


	return (
		isHeader ? 
			<div className = "flex flex-col gap-y-2">
				<CardContent 
					imageHeight={imageHeight} 
					playlist={playlist} 
					thumbnail={thumbnail} 
					isHeader={isHeader}
					canPlay={false}
				>
					{children}
				</CardContent>
			</div>
			:
			<div className = "flex flex-col gap-y-2">
				<CardContent 
					imageHeight={imageHeight} 
					playlist={playlist} 
					thumbnail={thumbnail} 
					isHeader={isHeader}
					canPlay={true}
					imagePlayButtonProps={{
						onPress: () => {
							if (isPlaying && currentPlaylist?.playlistId === playlist?.playlistId){
								onPause()
							}
							else {
								onPressPlay()
							}
						},
						imageHeight: imageHeight ?? "h-32", 
					    imageWidth: imageHeight ?? "w-32",
					    playButtonWidth: "w-6", 
					    playButtonHeight: "h-6",
					    imageURL: thumbnail?.url ?? "", 
					    showPlayButton: isPlaying && currentPlaylist?.playlistId === playlist?.playlistId
					}}
				>
					{children}
				</CardContent>
			</div>
	)
}
