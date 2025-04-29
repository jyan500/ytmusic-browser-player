import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { PlaybackInfo, Track } from "../types/common"

type QueuedTrackListState = {
    showQueuedTrackList: boolean
    playlistTitle?: string
}

const initialState: QueuedTrackListState = {
    showQueuedTrackList: false,
    playlistTitle: ""
}

const queuedTrackListSlice = createSlice({
    name: 'queuedTrackList',
    initialState,
    reducers: {
        setShowQueuedTrackList: (state, action: PayloadAction<boolean>) => {
            state.showQueuedTrackList = action.payload
        },
        setPlaylistTitle: (state, action: PayloadAction<string>) => {
            state.playlistTitle  = action.payload 
        }
    },
})

export const { 
    setShowQueuedTrackList,
    setPlaylistTitle
} = queuedTrackListSlice.actions

export const queuedTrackListReducer = queuedTrackListSlice.reducer
