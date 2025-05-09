import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, SONG_URL } from "../../helpers/urls" 
import { CustomError, Song, PlaybackInfo, Track, Thumbnail } from "../../types/common" 
import { privateApi } from "../private" 

export const songsApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getSong: builder.query<Song, string>({
			query: (videoId) => ({
				url: `${SONG_URL}/${videoId}`,
				method: "GET",
			}),
			providesTags: ["Songs"],
		}),
		getSongPlayback: builder.query<PlaybackInfo, string>({
			query: (videoId) => ({
				url: `${SONG_URL}/${videoId}/playback`,
				method: "GET",
			}),
			providesTags: ["PlaybackInfo"],
		}),
		getRelatedTracks: builder.query<Array<Track>, string>({
			query: (videoId) => ({
				url: `${SONG_URL}/${videoId}/related-tracks`,
				method: "GET",
			}),
			transformResponse: (response: Array<Track>) => {
				// convert "length" to "duration" and "thumbnail" to thumbnails
				return response.map((track: Track) => {
					return {...track, thumbnails: track.thumbnail ?? [] as Thumbnail[], duration: track.length}
				})
			},
			providesTags: ["RelatedTracks"]
		})
	}),
})

export const { 
	useGetSongQuery,
	useLazyGetSongQuery,
	useGetSongPlaybackQuery,
	useLazyGetSongPlaybackQuery,
	useLazyGetRelatedTracksQuery,
} = songsApi 
