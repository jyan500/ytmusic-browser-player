import React, { useEffect } from "react";
import { OptionType, Track, Playlist } from "../types/common"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { setShowAudioPlayer, setIsPlaying, setCurrentTrack, setQueuedTracks, setIndex, setStoredPlaybackInfo, setIsLoading } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { IconPlay } from "../icons/IconPlay"
import { IconPause } from "../icons/IconPause"
import { useAudioPlayerContext } from "../context/AudioPlayerProvider"
import { ImagePlayButton } from "./ImagePlayButton"

export interface Props {
    data: Array<Track>;
    playlist: Playlist | undefined
    inQueueTrackList: boolean
}

export const TrackList = ({ data, playlist, inQueueTrackList }: Props) => {
    const dispatch = useAppDispatch()
    const { showAudioPlayer, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();
    const { audioRef } = useAudioPlayerContext()

    useEffect(() => {
        if (!isFetching && songData){
            dispatch(setIsLoading(false))
            dispatch(setIsPlaying(true))
            dispatch(setStoredPlaybackInfo(songData))
        }
    }, [songData, isFetching])

    const search = (videoId: string) => {
        // if we're inside the queued tracklist, use the cached results
        // otherwise, reload the song in case the cache results expire
        // on youtube's end
        trigger(videoId, showQueuedTrackList)
    }

    const onPress = (track: Track) => {
        if (currentTrack?.videoId === track.videoId){
            dispatch(setIsPlaying(!isPlaying))
        }
        else {
            dispatch(setIsLoading(true))
            const queuedTrack = queuedTracks.find((qTrack) => qTrack.videoId === track.videoId)
            if (!queuedTrack){
                // special case: if we're not in the queued track list, and we don't have
                // a playlist loaded, or we're currently in a different playlist,
                // load the tracks on the current playlist
                // and then set index to be the current track. This way, if we play a song in the playlist,
                // it'll load the rest of the playlist in queue.
                if (!inQueueTrackList && (playlist && currentPlaylist?.playlistId !== playlist.playlistId) || !playlist){
                    dispatch(setQueuedTracks(data))
                    if (playlist){
                        dispatch(setPlaylist(playlist))
                    }
                    const index = data.indexOf(track)
                    dispatch(setIndex(index))
                }
                // otherwise, just queue this track
                else {
                    dispatch(setQueuedTracks([...queuedTracks, track]))
                }
            }
            // if there are queued tracks and we're playing a song in the queue
            // set the index to this track
            else {
                const index = queuedTracks.indexOf(queuedTrack)
                dispatch(setIndex(index))
            }
            dispatch(setCurrentTrack(track))
            if (!showAudioPlayer){
                dispatch(setShowAudioPlayer(true))
            }
            search(track.videoId)
        }
    }

    const rowContent = (track: Track) => {
        return (
            <>
                <p className = "font-bold">{track.title ?? ""}</p>
                <div className = "flex flex-row gap-x-2">
                    {
                        track.artists?.map((artist: OptionType) => {
                            return (
                                <p key={artist.id}>{artist.name}</p>
                            )
                        })
                    }
                </div>
            </>
        )
    }

    return (
        <ul className="flex flex-col gap-y-2">
            {data?.map((track: Track) => (
                <li 
                onClick={() => onPress(track)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " "){
                        onPress(track)
                    }
                }} tabIndex={0} key={track.videoId} className={`hover:cursor-pointer group flex flex-row justify-between items-center ${currentTrack?.videoId === track.videoId ? "bg-orange-secondary" : ""}`}>
                    <div className = "flex flex-row gap-x-2">
                        <ImagePlayButton 
                            playButtonWidth={"w-6"}
                            playButtonHeight={"h-6"}
                            imageWidth={"w-24"}
                            imageHeight={"h-16"}
                            showPlayButton={isPlaying && currentTrack?.videoId === track.videoId}
                            onPress={() => onPress(track)}
                            imageURL={track.thumbnails?.[0].url}
                        />
                        <div className = "py-1 flex flex-col gap-y-2">
                            {rowContent(track)}
                        </div>
                    </div>
                    <div className = "pr-2">
                        <p>{track.duration}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}
