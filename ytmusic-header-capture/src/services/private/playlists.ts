import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, PLAYLIST_URL } from "../../helpers/urls" 
import { CustomError, Playlist, PlaylistInfo, Track, ListResponse } from "../../types/common" 
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
	}),
})

export const { 
	useGetPlaylistsQuery, 
	useGetPlaylistQuery,
	useGetPlaylistTracksQuery,
} = playlistsApi 
