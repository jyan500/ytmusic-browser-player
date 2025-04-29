import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { PlaybackInfo, Track } from "../types/common"

type AudioPlayerState = {
   storedPlaybackInfo: PlaybackInfo | null
   queuedTracks: Array<Track>
   shuffledQueuedTracks: Array<Track>
   currentTrack: Track | null
   showAudioPlayer: boolean
   isLoading: boolean
   isShuffling: boolean
   isPlaying: boolean
   timeProgress: number
   duration: number
   index: number
}

const initialState: AudioPlayerState = {
    storedPlaybackInfo: null,
    queuedTracks: [],
    shuffledQueuedTracks: [],
    index: 0,
    currentTrack: null,
    showAudioPlayer: false,
    isLoading: false,
    isPlaying: false,
    isShuffling: false,
    timeProgress: 0,
    duration: 0
}

const audioPlayerSlice = createSlice({
    name: 'audioPlayer',
    initialState,
    reducers: {
        setStoredPlaybackInfo: (state, action: PayloadAction<PlaybackInfo>) => {
            state.storedPlaybackInfo = action.payload
        },
        setQueuedTracks: (state, action: PayloadAction<Array<Track>>) => {
            state.queuedTracks = action.payload            
        },
        setCurrentTrack: (state, action: PayloadAction<Track>) => {
            state.currentTrack = action.payload
        },
        setShowAudioPlayer: (state, action: PayloadAction<boolean>) => {
            state.showAudioPlayer = action.payload
        },
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload 
        },
        setIsPlaying: (state, action: PayloadAction<boolean>) => {
            state.isPlaying = action.payload
        },
        setTimeProgress: (state, action: PayloadAction<number>) => {
            state.timeProgress = action.payload 
        },
        setDuration: (state, action: PayloadAction<number>) => {
            state.duration = action.payload 
        },
        setIndex: (state, action: PayloadAction<number>) => {
           state.index = action.payload 
        },
        setIsShuffling: (state, action: PayloadAction<boolean>) => {
            state.isShuffling = action.payload 
        },
        setShuffledQueuedTracks: (state, action: PayloadAction<Array<Track>>) => {
            state.shuffledQueuedTracks = action.payload
        }
    },
})

export const { 
    setStoredPlaybackInfo, 
    setQueuedTracks, 
    setCurrentTrack, 
    setShowAudioPlayer, 
    setTimeProgress,
    setIsLoading,
    setIsPlaying,
    setIsShuffling,
    setShuffledQueuedTracks,
    setDuration,
    setIndex,
} = audioPlayerSlice.actions

export const audioPlayerReducer = audioPlayerSlice.reducer
