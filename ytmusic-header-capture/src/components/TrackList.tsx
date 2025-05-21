import React, { useEffect } from "react";
import { OptionType, Track, QueueItem, Thumbnail, Playlist } from "../types/common"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { setShowAudioPlayer, setSuggestedTracks, setIsPlaying, setCurrentTrack, setQueuedTracks, setIndex, setStoredPlaybackInfo, setIsLoading } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { IconPlay } from "../icons/IconPlay"
import { IconPause } from "../icons/IconPause"
import { useAudioPlayerContext } from "../context/AudioPlayerProvider"
import { ImagePlayButton } from "./ImagePlayButton"
import { getThumbnail, prepareQueueItems } from "../helpers/functions"
import { isQueueItem } from "../helpers/type-guards"
import { useLoadTrack } from "../hooks/useLoadTrack"

export interface Props {
    data: Array<Track | QueueItem>;
    playlist: Playlist | undefined
    inQueueTrackList: boolean
}

export const TrackList = ({ data, playlist, inQueueTrackList }: Props) => {
    const dispatch = useAppDispatch()
    const { showAudioPlayer, suggestedTracks, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const { triggerLoadTrack } = useLoadTrack()

    const rowContent = (track: Track | QueueItem) => {
        return (
            <>
                <p className = "font-bold">{track?.title ?? ""}</p>
                <div className = "flex flex-row gap-x-2">
                    {
                        track?.artists?.map((artist: OptionType) => {
                            return (
                                <p key={artist.id}>{artist.name}</p>
                            )
                        })
                    }
                </div>
            </>
        )
    }

    const shouldHighlightRow = (track: Track | QueueItem) => {
        return inQueueTrackList && isQueueItem(track) ? currentTrack?.queueId === track.queueId : currentTrack?.videoId === track.videoId
    }

    return (
        <ul className="flex flex-col gap-y-2">
            {data?.map((track: Track | QueueItem) => (
                <li 
                    onClick={() => {
                        const availability = track?.isAvailable ?? true
                        if (availability){
                            triggerLoadTrack(playlist ?? {} as Playlist, track)
                        }
                    }
                }
                // onKeyDown={(e) => {
                //     if (e.key === "Enter" || e.key === " "){
                //         onPress(track)
                //     }
                // }} 
                tabIndex={0} 
                key={isQueueItem(track) ? track.queueId : track.videoId} 
                className={`hover:cursor-pointer group flex flex-row justify-between items-center ${shouldHighlightRow(track) ? "bg-orange-secondary" : ""}`}>
                    <div className = "flex flex-row gap-x-2">
                        <ImagePlayButton 
                            playButtonWidth={"w-6"}
                            playButtonHeight={"h-6"}
                            imageWidth={"w-24"}
                            imageHeight={"h-16"}
                            isAvailable={track.isAvailable ?? true}
                            showPauseButton={isPlaying && currentTrack?.videoId === track.videoId}
                            onPress={() => triggerLoadTrack(playlist ?? {} as Playlist, track)}
                            imageURL={getThumbnail(track)?.url ?? ""}
                        />
                        <div className = "py-1 flex flex-col gap-y-2">
                            {rowContent(track)}
                        </div>
                    </div>
                    <div className = "pr-2">
                        <p>{track.duration ?? ""}</p>
                    </div>
                </li>
            ))}
        </ul>
    )
}
