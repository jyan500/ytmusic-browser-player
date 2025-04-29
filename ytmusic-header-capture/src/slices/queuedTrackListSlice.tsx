import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { PlaybackInfo, Track } from "../types/common"

type QueuedTrackListState = {
    showQueuedTrackList: boolean
}

const initialState: QueuedTrackListState = {
    showQueuedTrackList: false
}

const queuedTrackListSlice = createSlice({
    name: 'queuedTrackList',
    initialState,
    reducers: {
        setShowQueuedTrackList: (state, action: PayloadAction<boolean>) => {
            state.showQueuedTrackList = action.payload
        }
    },
})

export const { 
    setShowQueuedTrackList
} = queuedTrackListSlice.actions

export const queuedTrackListReducer = queuedTrackListSlice.reducer
