import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Playlist, PlaybackInfo, Track } from "../types/common"

type QueuedTrackListState = {
    showQueuedTrackList: boolean
    playlist?: Playlist
}

const initialState: QueuedTrackListState = {
    showQueuedTrackList: false,
    playlist: undefined
}

const queuedTrackListSlice = createSlice({
    name: 'queuedTrackList',
    initialState,
    reducers: {
        setShowQueuedTrackList: (state, action: PayloadAction<boolean>) => {
            state.showQueuedTrackList = action.payload
        },
        setPlaylist: (state, action: PayloadAction<Playlist>) => {
            state.playlist  = action.payload 
        }
    },
})

export const { 
    setShowQueuedTrackList,
    setPlaylist
} = queuedTrackListSlice.actions

export const queuedTrackListReducer = queuedTrackListSlice.reducer
