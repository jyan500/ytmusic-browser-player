import { createStore } from "redux"
import { configureStore } from "@reduxjs/toolkit" 
import { publicApi } from "./services/public"
import { privateApi } from "./services/private"
import { authReducer } from "./slices/authSlice"
import { userProfileReducer } from "./slices/userProfileSlice"

export const store = configureStore({
	reducer: {
		[privateApi.reducerPath]: privateApi.reducer,
		[publicApi.reducerPath]: publicApi.reducer,
		auth: authReducer,
		userProfile: userProfileReducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware()
	.concat(publicApi.middleware)
	.concat(privateApi.middleware)
})


// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



