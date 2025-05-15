import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, ALBUM_URL } from "../../helpers/urls" 
import { CustomError, Album, Song, PlaybackInfo, Track, Thumbnail } from "../../types/common" 
import { privateApi } from "../private" 

export const albumsApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getAlbum: builder.query<Album, string>({
			query: (browseId) => ({
				url: `${ALBUM_URL}/${browseId}`,
				method: "GET",
			}),
			providesTags: ["Albums"],
		}),
	}),
})

export const { 
	useGetAlbumQuery,
	useLazyGetAlbumQuery,
} = albumsApi 
