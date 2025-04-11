import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

type AuthState = {
    headers: string | null,
}

const initialState: AuthState = {
	headers: localStorage.getItem("headers") ?? null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("headers")
            state.headers = null
        },
        setCredentials: (state, {payload: { headers }}: PayloadAction<{ headers: string }>) => {
            localStorage.setItem("headers", headers)
            state.headers = headers
        },
    },
})

export const { logout, setCredentials } = authSlice.actions

export const authReducer = authSlice.reducer
