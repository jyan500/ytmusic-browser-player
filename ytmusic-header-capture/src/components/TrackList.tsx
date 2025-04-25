import React, { useEffect } from "react";
import { OptionType, Track } from "../types/common"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { setIsPlaying, setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setIsLoading } from "../slices/audioPlayerSlice"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { IconPlay } from "../icons/IconPlay"
import { useAudioPlayerContext } from "../context/AudioPlayerProvider"

type Props = {
    data: Array<Track>;
}

export const TrackList = ({ data }: Props) => {
    const dispatch = useAppDispatch()
    const { currentTrack, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const [ trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();
    const { audioRef } = useAudioPlayerContext()

    useEffect(() => {
        if (!isFetching && songData){
            dispatch(setStoredPlaybackInfo([songData, ...storedPlaybackInfo]))
            dispatch(setIsLoading(false))
            dispatch(setIsPlaying(true))
        }
    }, [songData, isFetching])

    const search = (videoId: string) => {
        trigger(videoId)
    }

    const onPress = (track: Track) => {
        dispatch(setIsLoading(true))
        dispatch(setCurrentTrack(track))
        search(track.videoId)
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
        <ul className="flex flex-col">
            {data?.map((track: Track) => (
                <li 
                onClick={() => onPress(track)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " "){
                        onPress(track)
                    }
                }} tabIndex={0} key={track.videoId} className={`hover:cursor-pointer group flex flex-row justify-between items-center py-2 ${currentTrack?.videoId === track.videoId ? "bg-orange-secondary" : ""}`}>
                    <div className = "flex flex-row gap-x-2">
                        <div className = "w-24 h-16 overflow-hidden relative">
                            <img className = "w-24 h-16 object-cover" src = {track.thumbnails?.[0]?.url}/> 
                            <div className = "absolute flex justify-center items-center inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                <button onClick={() => onPress(track)}><IconPlay className={"h-6 w-6 text-white"}/></button>
                            </div>
                        </div>
                        <div className = "flex flex-col gap-y-2">
                            {rowContent(track)}
                        </div>
                    </div>
                    <div>
                        <p>{track.duration}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}
