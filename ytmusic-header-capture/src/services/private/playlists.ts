import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, PLAYLIST_URL } from "../../helpers/urls" 
import { CustomError, WatchPlaylist, Playlist, Thumbnail, PlaylistInfo, Track, ListResponse } from "../../types/common" 
import { privateApi } from "../private" 

export const playlistsApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getPlaylists: builder.query<Array<Playlist>, Record<string, any>>({
			query: (params) => ({
				url: PLAYLIST_URL,
				method: "GET",
				params: params
			}),
			providesTags: ["Playlists"]	
		}),
		getPlaylist: builder.query<PlaylistInfo, {playlistId: string, params: Record<string, any>}>({
			query: ({playlistId, params}) => ({
				url: `${PLAYLIST_URL}/${playlistId}`,
				method: "GET",
				params: params
			}),
			providesTags: ["Playlists"]	
		}),
		getPlaylistTracks: builder.query<Array<Track>, {playlistId: string, params: Record<string, any>}>({
			query: ({playlistId, params}) => ({
				url: `${PLAYLIST_URL}/${playlistId}/tracks`,
				method: "GET",
				params: params
			}),
			providesTags: ["PlaylistTracks"]
		}),
		getPlaylistRelatedTracks: builder.query<Array<Track>, {playlistId: string, videoId: string}>({
			query: ({playlistId, videoId}) => ({
				url: `${PLAYLIST_URL}/${playlistId}/related-tracks`,
				method: "GET",
				params: {
					videoId: videoId
				}
			}),
			transformResponse: (response: Array<Track>) => {
				// convert "length" to "duration" and "thumbnail" to thumbnails
				return response.map((track: Track) => {
					return {...track, thumbnails: track.thumbnail ?? [] as Thumbnail[], duration: track.length}
				})
			},
			providesTags: ["PlaylistTracks"]
		}),
		getWatchPlaylist: builder.query<WatchPlaylist, {videoId: string}>({
			query: ({videoId}) => ({
				url: `${PLAYLIST_URL}/watch-playlist`,
				method: "GET",
				params: {
					videoId: videoId
				}
			}),
			transformResponse: (response: WatchPlaylist) => {
				// convert "length" to "duration" and "thumbnail" to thumbnails
				return {
					...response,
					tracks: response.tracks.map((track: Track) => {
						return {...track, thumbnails: track.thumbnail ?? [] as Thumbnail[], duration: track.length}
					})
				}
			},
		}),
	}),
})

export const { 
	useGetPlaylistsQuery, 
	useGetPlaylistQuery,
	useGetPlaylistTracksQuery,
	useLazyGetPlaylistTracksQuery,
	useLazyGetPlaylistRelatedTracksQuery,
	useLazyGetWatchPlaylistQuery,
} = playlistsApi 
