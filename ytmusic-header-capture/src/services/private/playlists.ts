import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, PLAYLIST_URL } from "../../helpers/urls" 
import { CustomError, WatchPlaylist, Playlist, Thumbnail, PlaylistInfo, Track, ListResponse, VideoItem } from "../../types/common" 
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
			providesTags: (result) =>
				result
					? [
						{ type: "Playlists", id: "LIST" }, // for the whole list
						...result.map((playlist) => ({ type: "Playlists" as const, id: playlist.playlistId }))
					]
					: [{ type: "Playlists", id: "LIST" }],
		}),
		getPlaylist: builder.query<PlaylistInfo, {playlistId: string, params: Record<string, any>}>({
			query: ({playlistId, params}) => ({
				url: `${PLAYLIST_URL}/${playlistId}`,
				method: "GET",
				params: params
			}),
			providesTags: (result, error, { playlistId }) => [{ type: "Playlists", id: playlistId }],
		}),
		getPlaylistTracks: builder.query<Array<Track>, {playlistId: string, params: Record<string, any>}>({
			query: ({playlistId, params}) => ({
				url: `${PLAYLIST_URL}/${playlistId}/tracks`,
				method: "GET",
				params: params
			}),
			providesTags: ["PlaylistTracks"]
		}),
		addPlaylistItems: builder.mutation<{message: string}, {playlistId: string, videoIds: Array<string>}>({
			query: ({playlistId, videoIds}) => ({
				url: `${PLAYLIST_URL}/${playlistId}`,
				method: "POST",
				body: {
					videoIds: videoIds
				}
			}),
			// invalidatesTags: ["Playlists", "PlaylistTracks", "Home"]
			invalidatesTags: (result, error, { playlistId }) => [
				// update all playlists and also the specific playlist
				{ type: "Playlists", id: "LIST"},
				{ type: "Playlists", id: playlistId },
				"Home",
			]
		}),
		removePlaylistItems: builder.mutation<{message: string}, {playlistId: string, videoItems: Array<VideoItem>}>({
			query: ({playlistId, videoItems}) => ({
				url: `${PLAYLIST_URL}/${playlistId}`,
				method: "DELETE",
				body: {
					videoItems: videoItems
				}
			}),
			invalidatesTags: (result, error, { playlistId }) => [
				// update all playlists and also the specific playlist
				{ type: "Playlists", id: "LIST"},
				{ type: "Playlists", id: playlistId },
				"Home",
			]
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
	useLazyGetPlaylistsQuery,
	useLazyGetPlaylistQuery,
	useLazyGetPlaylistTracksQuery,
	useLazyGetPlaylistRelatedTracksQuery,
	useLazyGetWatchPlaylistQuery,
	useAddPlaylistItemsMutation,
	useRemovePlaylistItemsMutation
} = playlistsApi 
