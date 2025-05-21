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
import { Album as TAlbum, Playlist, Track } from "../types/common"
import { goBack } from "react-chrome-extension-router"
import { NavButton } from "./NavButton"
import { useGetPlaylistTracksQuery, useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { useGetAlbumQuery } from "../services/private/albums"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { InfiniteScrollList } from "./InfiniteScrollList"
import { TrackList, Props as TrackListPropType } from "./TrackList"
import { PlaylistCardItem } from "./PlaylistCardItem"
import { PlayButton } from "./PlayButton"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { prepareQueueItems, randRange } from "../helpers/functions"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { LoadingSpinner } from "./elements/LoadingSpinner"

interface Props {
	playlist: Playlist
	tracks: Array<Track>
}

export const PlaylistPageContainer = ({playlist, tracks}: Props) => {
	const dispatch = useAppDispatch()
	const { triggerLoadPlaylist } = useLoadPlaylist()
	const { isPlaying, queuedTracks, showAudioPlayer, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
	const divRef = useRef<HTMLDivElement | null>(null)

	const onPause = () => {
		dispatch(setIsPlaying(false))		
	}

	return (
		<div className = "space-y-2">
			<NavButton onClick={() => {goBack()}} message={"Go Back"}/>
			<div className = "flex flex-col justify-center items-center">
				<PlaylistCardItem isHeader={true} imageWidth={"w-64"} imageHeight={"h-64"} playlist={playlist}>	
					<div className = "w-full flex flex-row justify-center items-center">
						<PlayButton isPlaying={isPlaying && currentPlaylist?.playlistId === playlist.playlistId} onClick={() => {
							// if the playlist is the currently selected playlist
							if (currentPlaylist?.playlistId === playlist.playlistId){
								// if there are queued tracks and a current song playing, toggle the playback
								if (queuedTracks?.length && storedPlaybackInfo){
									dispatch(setIsPlaying(!isPlaying))
								}
							}
							// Otherwise, load the playlist tracks and the first song of the playlist.
							else {
								triggerLoadPlaylist(playlist, tracks)
							}
						}} />
					</div>
				</PlaylistCardItem>
			</div>
			<div>
				<InfiniteScrollList<Track, Omit<TrackListPropType, "data">> data={tracks ?? []} props={{
					playlist: playlist,
					inQueueTrackList: false
				}} component={TrackList}/>
			</div>
		</div>
	)
}
