import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, USER_URL } from "../../helpers/urls" 
import { CustomError, User } from "../../types/common" 
import { privateApi } from "../private" 

export const usersApi = privateApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		getUser: builder.query<User, string>({
			query: (channelId) => ({
				url: `${USER_URL}/${channelId}`,
				method: "GET",
			}),
			providesTags: ["Users"],
		}),
	}),
})

export const { 
	useGetUserQuery,
	useLazyGetUserQuery,
} = usersApi 
