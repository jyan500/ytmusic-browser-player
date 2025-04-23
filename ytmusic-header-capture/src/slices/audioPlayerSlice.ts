import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { PlaybackInfo, Track } from "../types/common"

type AudioPlayerState = {
   storedPlaybackInfo: Array<PlaybackInfo> 
   queuedTracks: Array<Track>
   currentTrack: Track | null
   showAudioPlayer: boolean
   isLoading: boolean
}

const initialState: AudioPlayerState = {
    storedPlaybackInfo: [],
    queuedTracks: [],
    currentTrack: null,
    showAudioPlayer: false,
    isLoading: false
}

const audioPlayerSlice = createSlice({
    name: 'audioPlayer',
    initialState,
    reducers: {
        setStoredPlaybackInfo: (state, action: PayloadAction<Array<PlaybackInfo>>) => {
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
        }
    },
})

export const { 
    setStoredPlaybackInfo, 
    setQueuedTracks, 
    setCurrentTrack, 
    setShowAudioPlayer, 
    setIsLoading 
} = audioPlayerSlice.actions

export const audioPlayerReducer = audioPlayerSlice.reducer
