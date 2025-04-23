import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, SONG_URL } from "../../helpers/urls" 
import { CustomError, Song, PlaybackInfo } from "../../types/common" 
import { privateApi } from "../private" 

export const songsApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getSong: builder.query<Song, string>({
			query: (videoId) => ({
				url: `${SONG_URL}/${videoId}`,
				method: "GET",
			}),
			providesTags: ["songs"],
		}),
		getSongPlayback: builder.query<PlaybackInfo, string>({
			query: (videoId) => ({
				url: `${SONG_URL}/${videoId}/playback`,
				method: "GET",
			}),
			providesTags: ["playbackInfo"],
		})
	}),
})

export const { 
	useGetSongQuery,
	useLazyGetSongQuery,
	useGetSongPlaybackQuery,
	useLazyGetSongPlaybackQuery,
} = songsApi 
