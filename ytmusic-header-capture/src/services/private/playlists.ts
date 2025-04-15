import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, PLAYLIST_URL } from "../../helpers/urls" 
import { CustomError, Playlist, ListResponse } from "../../types/common" 
import { privateApi } from "../private" 

export const playlistsApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getPlaylists: builder.query<ListResponse<Playlist>, Record<string, any>>({
			query: (params) => ({
				url: PLAYLIST_URL,
				method: "GET",
				params: params
			})	
		}),
	}),
})

export const { 
	useGetPlaylistsQuery, 
} = playlistsApi 
