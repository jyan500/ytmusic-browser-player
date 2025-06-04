import React, { useEffect, useState, useRef } from "react";
import { OptionType, Track, QueueItem, Thumbnail, Playlist } from "../types/common"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { setShowAudioPlayer, setSuggestedTracks, setIsPlaying, setCurrentTrack, setQueuedTracks, setIndex, setStoredPlaybackInfo, setIsLoading } from "../slices/audioPlayerSlice"
import { setShowQueuedTrackList, setPlaylist } from "../slices/queuedTrackListSlice"
import { useLazyGetSongPlaybackQuery } from "../services/private/songs"
import { useLazyGetPlaylistRelatedTracksQuery } from "../services/private/playlists"
import { IconPlay } from "../icons/IconPlay"
import { IconPause } from "../icons/IconPause"
import { IconVerticalMenu } from "../icons/IconVerticalMenu"
import { useAudioPlayerContext } from "../context/AudioPlayerProvider"
import { ImagePlayButton } from "./ImagePlayButton"
import { getThumbnail, prepareQueueItems } from "../helpers/functions"
import { isQueueItem } from "../helpers/type-guards"
import { useLoadTrack } from "../hooks/useLoadTrack"
import { TrackDropdown } from "./dropdowns/TrackDropdown"
import { useClickOutside } from "../hooks/useClickOutside"
import { TrackListRow } from "./TrackListRow"

export interface Props {
    data: Array<Track | QueueItem>;
    playlist: Playlist | undefined
    inQueueTrackList: boolean
}

export const TrackList = ({ data, playlist, inQueueTrackList }: Props) => {
    const dispatch = useAppDispatch()
    const { showAudioPlayer, suggestedTracks, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { triggerLoadTrack } = useLoadTrack()

    const shouldHighlightRow = (track: Track | QueueItem) => {
        return inQueueTrackList && isQueueItem(track) ? currentTrack?.queueId === track.queueId : currentTrack?.videoId === track.videoId
    }


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

    return (
        <ul className="flex flex-col gap-y-2">
            {data?.map((track: Track | QueueItem) => (
                <TrackListRow 
                    key={isQueueItem(track) ? track.queueId : track.videoId} 
                    showPauseButton={isPlaying && currentTrack?.videoId === track.videoId}
                    triggerLoadTrack={() => triggerLoadTrack(playlist ?? {} as Playlist, track)}
                    shouldHighlightRow={shouldHighlightRow(track)} 
                    thumbnail={getThumbnail(track)?.url ?? ""}
                    rowContent={rowContent(track)}
                    track={track}
                />
            ))}
        </ul>
    )
}
