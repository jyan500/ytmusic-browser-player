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
import { IconEdit } from "../icons/IconEdit"
import { setIsOpen, setModalProps, setModalType } from "../slices/modalSlice"
import { IconVerticalMenu } from "../icons/IconVerticalMenu"
import { useClickOutside } from "../hooks/useClickOutside"
import { PlaylistDropdown } from "./dropdowns/PlaylistDropdown"

interface Props {
	playlist: Playlist
	tracks: Array<Track>
}

export const PlaylistPageContainer = ({playlist, tracks}: Props) => {
	const dispatch = useAppDispatch()
	const [ showDropdown, setShowDropdown ] = useState(false)
	const { triggerLoadPlaylist } = useLoadPlaylist()
	const { isPlaying, queuedTracks, showAudioPlayer, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
	const dropdownRef = useRef<HTMLDivElement | null>(null)
	const buttonRef = useRef<HTMLButtonElement | null>(null)

	const onPause = () => {
		dispatch(setIsPlaying(false))		
	}

	useClickOutside(dropdownRef, () => setShowDropdown(false), buttonRef)

	return (
		<div className = "space-y-2">
			<NavButton onClick={() => {goBack()}} message={"Go Back"}/>
			<div className = "flex flex-col justify-center items-center">
				<PlaylistCardItem isHeader={true} imageWidth={"w-64"} imageHeight={"h-64"} playlist={playlist}>	
					<div className = "w-full flex flex-row justify-center items-center gap-x-4">
						{
							playlist.owned ? 
								<button onClick={() => {
									dispatch(setModalType("add-edit-playlist"))
									dispatch(setModalProps({
										playlistId: playlist.playlistId
									}))
									dispatch(setIsOpen(true))
								}} className = "hover:opacity-60 bg-dark w-10 h-10 rounded-full flex justify-center items-center">
									<IconEdit className = "w-6 h-6 text-white"/>
								</button>
							: null
						}
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
						{
							<div className = "relative">
								<button ref={buttonRef} onClick={() => {
									setShowDropdown(!showDropdown)
								}} className = "hover:opacity-60 bg-dark w-10 h-10 rounded-full flex justify-center items-center">
									<IconVerticalMenu className = "w-6 h-6 text-white"/>	
									
								</button>
								{
									showDropdown ? (
										<PlaylistDropdown 
											ref={dropdownRef}
											playlistId={playlist.playlistId} 
											owned={playlist.owned} 
											closeDropdown = {() => setShowDropdown(false)}
										/>
									) : null
								}
							</div>
						}
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
