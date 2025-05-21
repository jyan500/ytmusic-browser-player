import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, ARTIST_URL } from "../../helpers/urls" 
import { CustomError, Artist, Album } from "../../types/common" 
import { privateApi } from "../private" 

export const artistsApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getArtist: builder.query<Artist, string>({
			query: (browseId) => ({
				url: `${ARTIST_URL}/${browseId}`,
				method: "GET",
			}),
			providesTags: ["Artists"],
		}),
		getArtistAlbum: builder.query<Album, {browseId: string, params: string}>({
			query: ({browseId, params}) => ({
				url: `${ARTIST_URL}/albums/${browseId}`,
				method: "GET",
				params: {params: params}
			}),
		}),
	}),
})

export const { 
	useGetArtistQuery,
	useGetArtistAlbumQuery,
} = artistsApi 
