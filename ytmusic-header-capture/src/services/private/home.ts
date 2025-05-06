import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, HOME_URL } from "../../helpers/urls" 
import { CustomError, HomeContent } from "../../types/common" 
import { privateApi } from "../private" 

export const homeApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getHome: builder.query<Array<HomeContent>, Record<string,any>>({
			query: (params) => ({
				url: HOME_URL,
				method: "GET",
				params: params
			}),
			providesTags: ["Home"]	
		}),
	}),
})

export const { 
	useGetHomeQuery, 
	useLazyGetHomeQuery,
} = homeApi 
