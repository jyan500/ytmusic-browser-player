import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { PlaybackInfo, Track, QueueItem} from "../types/common"
import { DEFAULT_VOLUME } from "../helpers/constants"

type AudioPlayerState = {
   storedPlaybackInfo: PlaybackInfo | null
   queuedTracks: Array<QueueItem>
   shuffledQueuedTracks: Array<QueueItem>
   currentCardId: string
   suggestedTracks: Array<Track>
   currentTrack: QueueItem | null
   showAudioPlayer: boolean
   isLoading: boolean
   isShuffling: boolean
   isPlaying: boolean
   timeProgress: number
   volume: number
   muted: boolean
   duration: number
   index: number
   isAutoPlay: boolean
}

const initialState: AudioPlayerState = {
    storedPlaybackInfo: null,
    queuedTracks: [],
    suggestedTracks:[],
    shuffledQueuedTracks: [],
    index: 0,
    currentTrack: null,
    showAudioPlayer: false,
    currentCardId: "",
    isLoading: false,
    isPlaying: false,
    isShuffling: false,
    volume: DEFAULT_VOLUME,
    muted: false,
    timeProgress: 0,
    duration: 0,
    isAutoPlay: true 
}

const audioPlayerSlice = createSlice({
    name: 'audioPlayer',
    initialState,
    reducers: {
        setStoredPlaybackInfo: (state, action: PayloadAction<PlaybackInfo>) => {
            state.storedPlaybackInfo = action.payload
        },
        setQueuedTracks: (state, action: PayloadAction<Array<QueueItem>>) => {
            state.queuedTracks = action.payload            
        },
        setCurrentTrack: (state, action: PayloadAction<QueueItem>) => {
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
        setShuffledQueuedTracks: (state, action: PayloadAction<Array<QueueItem>>) => {
            state.shuffledQueuedTracks = action.payload
        },
        setSuggestedTracks: (state, action: PayloadAction<Array<Track>>) => {
            state.suggestedTracks = action.payload
        },
        setIsAutoPlay: (state, action: PayloadAction<boolean>) => {
            state.isAutoPlay = action.payload
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload
        },
        setMuted: (state, action: PayloadAction<boolean>) => {
            state.muted = action.payload
        },
        setCurrentCardId: (state, action: PayloadAction<string>) => {
            state.currentCardId = action.payload
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
    setCurrentCardId,
    setIsPlaying,
    setIsShuffling,
    setShuffledQueuedTracks,
    setSuggestedTracks,
    setDuration,
    setIndex,
    setIsAutoPlay,
    setVolume,
    setMuted,
} = audioPlayerSlice.actions

export const audioPlayerReducer = audioPlayerSlice.reducer
