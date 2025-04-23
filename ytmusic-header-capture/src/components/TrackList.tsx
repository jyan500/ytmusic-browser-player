import React, { useEffect } from "react";
import { OptionType, Track } from "../types/common"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { setCurrentTrack, setQueuedTracks, setStoredPlaybackInfo, setIsLoading } from "../slices/audioPlayerSlice"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { IconPlay } from "../icons/IconPlay"
import { AudioPlayer } from "./AudioPlayer"

type Props = {
    data: Array<Track>;
}

export const TrackList = ({ data }: Props) => {
    const dispatch = useAppDispatch()
    const { storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const [trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();

    useEffect(() => {
        if (!isFetching && songData){
            dispatch(setStoredPlaybackInfo([songData, ...storedPlaybackInfo]))
            dispatch(setIsLoading(false))
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
        <div className="flex flex-col gap-y-2">
            {data?.map((track: Track) => (
                <div key={track.videoId} className="flex flex-row justify-between items-center p-2 border border-gray-300 shadow-md">
                    <div className = "flex flex-row gap-x-2">
                        <div className = "w-24 h-16 overflow-hidden group relative">
                            <img className = "w-24 h-16" src = {track.thumbnails?.[0]?.url}/> 
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
                </div>
            ))}
        </div>
    )
}
