import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, LOGIN_URL } from "../../helpers/urls" 
import { CustomError } from "../../types/common" 
import { publicApi } from "../public" 

export interface UserResponse {
	accountName: string
    channelHandle: string 
    accountPhotoUrl: string
}

export interface LoginRequest {
	headers: string
}

export const authApi = publicApi.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		login: builder.mutation<UserResponse, LoginRequest>({
			query: ({headers}) => ({
				url: LOGIN_URL,
				method: "POST",
				body: {
					headers: headers 
				}
			})	
		}),
		protected: builder.mutation<{message: string}, void>({
			query: () => "protected",
		})
	}),
})

export const { 
	useLoginMutation, 
} = authApi 
