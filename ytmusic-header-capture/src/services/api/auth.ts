import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { BACKEND_BASE_URL, LOGIN_URL } from "../../helpers/urls" 
import { CustomError } from "../../types/common" 
import { api } from "../api" 

export interface UserResponse {
	token: string
}

export interface LoginRequest {
}

export const authApi = api.injectEndpoints({
	overrideExisting: false,
	endpoints: (builder) => ({
		login: builder.mutation<UserResponse, LoginRequest>({
			query: (credentials) => ({
				url: LOGIN_URL,
				method: "POST",
				body: {
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
