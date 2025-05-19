import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, ARTIST_URL } from "../../helpers/urls" 
import { CustomError, Artist } from "../../types/common" 
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
	}),
})

export const { 
	useGetArtistQuery,
} = artistsApi 
