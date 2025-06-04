import { createStore } from "redux"
import { configureStore, combineReducers } from "@reduxjs/toolkit" 
import { publicApi } from "./services/public"
import { privateApi } from "./services/private"
import { authReducer } from "./slices/authSlice"
import { userProfileReducer } from "./slices/userProfileSlice"
import { audioPlayerReducer } from "./slices/audioPlayerSlice"
import { queuedTrackListReducer } from "./slices/queuedTrackListSlice"
import { modalReducer } from "./slices/modalSlice"
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER,
} from "redux-persist"
import { localStorage } from 'redux-persist-webextension-storage';

const reducers = combineReducers({
	[privateApi.reducerPath]: privateApi.reducer,
	[publicApi.reducerPath]: publicApi.reducer,
	auth: authReducer,
	userProfile: userProfileReducer,
	audioPlayer: audioPlayerReducer,
	queuedTrackList: queuedTrackListReducer,
	modal: modalReducer
})

const persistConfig = {
	key: "root",
	version: 1,
	storage: localStorage,
	whitelist: [
		// "auth", 
		// "userProfile", 
		// "audioPlayer", 
		// "queuedTrackList"
	]
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
	reducer: persistedReducer, 
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: {
			ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
		},
	})
	.concat(publicApi.middleware)
	.concat(privateApi.middleware)
})

export let persistor = persistStore(store)

// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



