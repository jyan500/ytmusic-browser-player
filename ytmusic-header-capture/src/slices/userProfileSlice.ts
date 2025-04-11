import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { UserProfile } from "../types/common"
import { logout } from "./authSlice"

type UserProfileState = {
	userProfile: UserProfile | null,
}

const initialState: UserProfileState = {
	userProfile: null,
}

const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
      	setUserProfile: (state, { payload: { userProfile }}: PayloadAction<{ userProfile: UserProfile }>,
        ) => {
            state.userProfile = userProfile
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, () => {
            return initialState
        })
    }
})

export const { setUserProfile } = userProfileSlice.actions

export const userProfileReducer = userProfileSlice.reducer
