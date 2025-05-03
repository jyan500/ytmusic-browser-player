import React, {useState, useEffect, useRef} from "react"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"
import { 
	setSuggestedTracks, 
	setShowAudioPlayer, 
	setIsLoading, 
	setIsPlaying, 
	setCurrentTrack, 
	setQueuedTracks, 
	setStoredPlaybackInfo } 
from "../slices/audioPlayerSlice"
import { Playlist as TPlaylist, PlaylistInfo, Track } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"
import { useGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { PaginationRow } from "../components/PaginationRow"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { TrackList, Props as TrackListPropType } from "../components/TrackList"
import { PlaylistCardItem } from "../components/PlaylistCardItem"
import { PlayButton } from "../components/PlayButton"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"

interface Props {
	playlist: TPlaylist
}

export const Playlist = ({playlist}: Props) => {
	const [page, setPage] = useState(1)
	const dispatch = useAppDispatch()
	const { isPlaying, queuedTracks, showAudioPlayer, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
	const {data: tracks, isLoading: isTracksLoading, isError: isTracksError} = useGetPlaylistTracksQuery(playlist ? {playlistId: playlist.playlistId, params: {page: page, perPage: 10}} : skipToken)
    const [ trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();
    // const [ triggerRelatedTracks, {data: relatedTracksData, error: relatedTracksError, isFetching: isRelatedTracksFetching}] = useLazyGetPlaylistRelatedTracksQuery()
	const divRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		window.scrollTo({
			top: 0,
			left: 0,
			behavior: "smooth"
		})	
	}, [playlist])

	useEffect(() => {
        if (!isFetching && songData){
            dispatch(setStoredPlaybackInfo(songData))
            dispatch(setIsLoading(false))
            dispatch(setIsPlaying(true))
        }
    }, [songData, isFetching])

    // useEffect(() => {
    // 	if (!isRelatedTracksFetching && relatedTracksData){
    // 		dispatch(setSuggestedTracks(relatedTracksData))
    // 	}
    // }, [relatedTracksData, isRelatedTracksFetching])

	const onQueuePlaylist = () => {
		/* 
			1) put all tracks onto the queue
			2) set the current track
				- request the playback URL for this track
				if it's not already found	
			3) set the audio player to isPlaying
		*/
		if (tracks && tracks.length){
			const top = tracks[0]
			dispatch(setIsLoading(true))
			dispatch(setCurrentTrack(top))
			dispatch(setQueuedTracks(tracks))
            trigger(top.videoId)
            // triggerRelatedTracks({playlistId: playlist.playlistId, videoId: top.videoId})
		}
		dispatch(setPlaylist(playlist))
		if (!showAudioPlayer){
			dispatch(setShowAudioPlayer(true))
		}
		if (!showQueuedTrackList){
			dispatch(setShowQueuedTrackList(true))
		}
	}

	const onPause = () => {
		dispatch(setIsPlaying(false))		
	}

	return (
		<div className = "space-y-2">
			<NavButton onClick={(e) => {goTo(Playlists)}} message={"Go Back"}/>
			<div className = "flex flex-col justify-center items-center">
				<PlaylistCardItem isHeader={true} imageHeight={"h-64"} playlist={playlist}>	
					<div className = "w-full flex flex-row justify-center items-center">
						{
							!isTracksLoading && tracks ? 
								<PlayButton isPlaying={isPlaying && currentPlaylist?.playlistId === playlist?.playlistId} onClick={() => {
									// if the playlist is the currently selected playlist
									if (currentPlaylist?.playlistId === playlist?.playlistId){
										// if there are queued tracks and a current song playing, toggle the playback
										if (queuedTracks?.length && storedPlaybackInfo){
											dispatch(setIsPlaying(!isPlaying))
										}
									}
									// Otherwise, load the playlist tracks and the first song of the playlist.
									else {
										onQueuePlaylist()
									}
								}} /> : null
						}
					</div>
				</PlaylistCardItem>
			</div>
			<div>
				{
					isTracksLoading && !tracks ? <p>Tracks loading... </p> : (
						<InfiniteScrollList<Track, Omit<TrackListPropType, "data">> data={tracks ?? []} props={{
							playlist: playlist,
							inQueueTrackList: false
						}} component={TrackList}/>
					)
				}
			</div>
		</div>
	)
}
