import React, { useEffect } from "react";
import { OptionType, Track } from "../types/common"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { setShowAudioPlayer, setIsPlaying, setCurrentTrack, setQueuedTracks, setIndex, setStoredPlaybackInfo, setIsLoading } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList } from "../slices/queuedTrackListSlice"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { IconPlay } from "../icons/IconPlay"
import { IconPause } from "../icons/IconPause"
import { useAudioPlayerContext } from "../context/AudioPlayerProvider"

type Props = {
    data: Array<Track>;
}

export const TrackList = ({ data }: Props) => {
    const dispatch = useAppDispatch()
    const { showAudioPlayer, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList } = useAppSelector((state) => state.queuedTrackList)
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
                dispatch(setQueuedTracks([...queuedTracks, track]))
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
                        <div className = "w-24 h-16 overflow-hidden relative">
                            <img className = "w-24 h-16 object-cover" src = {track.thumbnails?.[0]?.url}/> 
                            <div className = "absolute flex justify-center items-center inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                <button onClick={() => onPress(track)}>
                                {
                                    isPlaying && currentTrack?.videoId === track.videoId ? 
                                    <IconPause className={"h-6 w-6 text-white"}/> :
                                    <IconPlay className={"h-6 w-6 text-white"}/>
                                }
                                </button>
                            </div>
                        </div>
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
