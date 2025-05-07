import React, {useState, useEffect} from "react"
import { goTo } from "react-chrome-extension-router"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { Thumbnail, Playlist as TPlaylist } from "../types/common"
import { Playlist } from "../pages/Playlist"
import { Props as ImagePlayButtonProps, ImagePlayButton } from "./ImagePlayButton"
import { setSuggestedTracks, setIsLoading, setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setShowAudioPlayer } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { prepareQueueItems, randRange } from "../helpers/functions"
import { PlayableCard } from "./PlayableCard"

interface Props {
	playlist: TPlaylist | undefined
	imageHeight?: string
	children?: React.ReactNode
	isHeader?: boolean
}

export const PlaylistCardItem = ({playlist, imageHeight, children, isHeader}: Props) => {
	// find the largest thumbnail and compress to fit 
	const dispatch = useAppDispatch()
	const { queuedTracks, isPlaying, showAudioPlayer, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
	const widths = playlist?.thumbnails?.map((thumbnail) => thumbnail.width) ?? []
	const biggestWidth = Math.max(...widths)
	const thumbnail = playlist?.thumbnails?.find((thumbnail) => thumbnail.width === biggestWidth)
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const [ triggerGetPlayback, { data: songData, error: songError, isFetching: isFetchingSong } ] = useLazyGetSongPlaybackQuery()
    const [ triggerRelatedTracks, {data: relatedTracksData, error: relatedTracksError, isFetching: isRelatedTracksFetching}] = useLazyGetPlaylistRelatedTracksQuery()

	const onPressPlay = () => {
		// need to get all the tracks for the playlist first when the button is clicked
		if (playlist){
			triggerGetTracks({playlistId: playlist?.playlistId, params: {page: 1, perPage: 10}})
		}
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
				const queueItems = prepareQueueItems(tracksData)
				const top = queueItems[0]
				dispatch(setIsLoading(true))
				dispatch(setCurrentTrack(top))
				dispatch(setQueuedTracks(queueItems))
	            triggerGetPlayback(top.videoId)
	            const randIndex = randRange(0, queueItems.length-1)
	            triggerRelatedTracks({playlistId: playlist.playlistId, videoId: queueItems[randIndex].videoId})
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

    useEffect(() => {
    	if (!isRelatedTracksFetching && relatedTracksData){
    		dispatch(setSuggestedTracks(relatedTracksData))
    	}
    }, [relatedTracksData, isRelatedTracksFetching])

	return (
		isHeader ? 
			<div className = "flex flex-col gap-y-2">
				<PlayableCard 
					imageHeight={imageHeight} 
					title={playlist?.title ?? ""}
					description={playlist?.description ?? ""}
					thumbnail={thumbnail} 
					isHeader={isHeader}
					canPlay={false}
				>
					{children}
				</PlayableCard>
			</div>
			:
			<div className = "flex flex-col gap-y-2">
				<PlayableCard 
					imageHeight={imageHeight} 
					title={playlist?.title ?? ""}
					description={playlist?.description ?? ""}
					thumbnail={thumbnail} 
					isHeader={isHeader}
					canPlay={true}
					cardOnClick={() => goTo(Playlist, {playlist})}
					imagePlayButtonProps={{
						onPress: () => {
							// if the playlist is the currently selected playlist
							if (currentPlaylist?.playlistId === playlist?.playlistId){
								// if there are queued tracks and a current song playing, toggle the playback
								if (queuedTracks?.length && storedPlaybackInfo){
									dispatch(setIsPlaying(!isPlaying))
								}
							}
							// Otherwise, load the playlist tracks and the first song of the playlist.
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
				</PlayableCard>
			</div>
	)
}
