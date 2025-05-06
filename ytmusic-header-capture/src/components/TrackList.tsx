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
import { prepareQueueItems } from "../helpers/functions"
import { isQueueItem } from "../helpers/type-guards"

export interface Props {
    data: Array<Track | QueueItem>;
    playlist: Playlist | undefined
    inQueueTrackList: boolean
}

export const TrackList = ({ data, playlist, inQueueTrackList }: Props) => {
    const dispatch = useAppDispatch()
    const { showAudioPlayer, suggestedTracks, queuedTracks, isPlaying, currentTrack, index, storedPlaybackInfo } = useAppSelector((state) => state.audioPlayer)
    const { showQueuedTrackList, playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ trigger, { data: songData, error, isFetching }] = useLazyGetSongPlaybackQuery();
    const [ triggerRelatedTracks, {data: relatedTracksData, error: relatedTracksError, isFetching: isRelatedTracksFetching}] = useLazyGetPlaylistRelatedTracksQuery()
    const { audioRef } = useAudioPlayerContext()

    useEffect(() => {
        if (!isFetching && songData){
            dispatch(setIsLoading(false))
            dispatch(setIsPlaying(true))
            dispatch(setStoredPlaybackInfo(songData))
        }
    }, [songData, isFetching])

    useEffect(() => {
        if (!isRelatedTracksFetching && relatedTracksData){
            dispatch(setSuggestedTracks(relatedTracksData))
        }
    }, [relatedTracksData, isRelatedTracksFetching])

    const search = (videoId: string) => {
        // if we're inside the queued tracklist, use the cached results
        // otherwise, reload the song in case the cache results expire
        // on youtube's end
        trigger(videoId, showQueuedTrackList)
    }

    const onPress = (track: Track | QueueItem) => {
        if (currentTrack?.videoId === track.videoId){
            dispatch(setIsPlaying(!isPlaying))
        }
        else {
            dispatch(setIsLoading(true))
            const queuedTrack = queuedTracks.find((qTrack) => qTrack.videoId === track.videoId)
            if (!queuedTrack){
                // // special case: if we're not in the queued track list, and we don't have
                // // a playlist loaded, or we're currently in a different playlist,
                // // load the tracks on the current playlist
                // // and then set index to be the current track. This way, if we play a song in the playlist,
                // // it'll load the rest of the playlist in queue.
                // if (!inQueueTrackList && (playlist && currentPlaylist?.playlistId !== playlist.playlistId) || !playlist){
                //     dispatch(setQueuedTracks(data))
                //     if (playlist){
                //         dispatch(setPlaylist(playlist))
                //     }
                //     const index = data.indexOf(track)
                //     dispatch(setIndex(index))
                // }
                // // otherwise, just queue this track only
                // else {
                //     dispatch(setQueuedTracks([track]))
                //     dispatch(setIndex(0))
                // }
                if (playlist){
                    if (playlist !== currentPlaylist){
                        // also clear out the suggestions, this will trigger the Controls component
                        // to automatically find new suggestions
                        dispatch(setSuggestedTracks([]))
                    }
                    dispatch(setPlaylist(playlist))
                }
                const queueItems = prepareQueueItems([track])
                dispatch(setQueuedTracks(queueItems))
                dispatch(setCurrentTrack(queueItems[0]))
                dispatch(setIndex(0))
            }
            // if there are queued tracks and we're playing a song in the queue
            // set the index to this track
            else {
                const index = queuedTracks.indexOf(queuedTrack)
                dispatch(setIndex(index))
                dispatch(setCurrentTrack(queuedTracks[index]))
            }
            if (!showAudioPlayer){
                dispatch(setShowAudioPlayer(true))
            }
            search(track.videoId)
        }
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

    const getThumbnailUrl = (track: Track | QueueItem) => {
        const widths = track?.thumbnails?.map((thumbnail: Thumbnail) => thumbnail.width) ?? []
        const biggestWidth = Math.max(...widths)
        return track?.thumbnails?.find((thumbnail: Thumbnail) => thumbnail.width === biggestWidth)?.url ?? ""
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
                            onPress(track)
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
                            showPlayButton={isPlaying && currentTrack?.videoId === track.videoId}
                            onPress={() => onPress(track)}
                            imageURL={getThumbnailUrl(track)}
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
