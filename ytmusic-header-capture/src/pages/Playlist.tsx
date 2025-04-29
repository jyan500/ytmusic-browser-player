import React, {useState, useEffect, useRef} from "react"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"
import { setIsLoading, setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo } from "../slices/audioPlayerSlice"
import { Playlist as TPlaylist, PlaylistInfo, Track } from "../types/common"
import { Playlists } from "../pages/Playlists"
import { goTo } from "react-chrome-extension-router"
import { NavButton } from "../components/NavButton"
import { useGetPlaylistTracksQuery } from "../services/private/playlists"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { skipToken } from '@reduxjs/toolkit/query/react'
import { PaginationRow } from "../components/PaginationRow"
import { InfiniteScrollList } from "../components/InfiniteScrollList"
import { TrackList } from "../components/TrackList"
import { PlaylistCardItem } from "../components/PlaylistCardItem"
import { PlayButton } from "../components/PlayButton"

interface Props {
	playlist: TPlaylist
}

export const Playlist = ({playlist}: Props) => {
	const [page, setPage] = useState(1)
	const dispatch = useAppDispatch()
	const { storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
	const {data: tracks, isLoading: isTracksLoading, isError: isTracksError} = useGetPlaylistTracksQuery(playlist ? {playlistId: playlist.playlistId, params: {page: page, perPage: 10}} : skipToken)
    const [ trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();
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
		}
	}

	return (
		<div>
			<NavButton onClick={(e) => {goTo(Playlists)}} message={"Go Back"}/>
			<div className = "flex flex-col justify-center items-center">
				<PlaylistCardItem isHeader={true} imageHeight={"h-64"} playlist={playlist}>	
					<div className = "w-full flex flex-row justify-center items-center">
						{
							!isTracksLoading && tracks ? 
								<PlayButton onClick={() => onQueuePlaylist()} /> : null
						}
					</div>
				</PlaylistCardItem>
			</div>
			<div>
				{
					isTracksLoading && !tracks ? <p>Tracks loading... </p> : (
						<InfiniteScrollList<Track> data={tracks ?? []} component={TrackList}/>
					)
				}
			</div>

		</div>
	)
}
