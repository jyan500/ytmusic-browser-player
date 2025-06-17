import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, SEARCH_URL } from "../../helpers/urls" 
import { CustomError, SearchContent, SearchSuggestionContent } from "../../types/common" 
import { privateApi } from "../private" 

export const searchApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getSearch: builder.query<Array<SearchContent>, Record<string,any>>({
			query: (params) => ({
				url: SEARCH_URL,
				method: "GET",
				params: params
			}),
			providesTags: ["Search"]	
		}),
		getSearchSuggestions: builder.query<Array<SearchSuggestionContent>, Record<string, any>>({
			query: (params) => ({
				url: `${SEARCH_URL}/suggestions`,
				method: "GET",
				params: params
			}),
			providesTags: ["SearchSuggestions"]
		})
	}),
})

export const { 
	useGetSearchQuery, 
	useLazyGetSearchSuggestionsQuery, 
} = searchApi 
