import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import type {
	BaseQueryFn,	
	FetchArgs,
	FetchBaseQueryError
} from "@reduxjs/toolkit/query"
import { CustomError } from "../types/common"
import { BACKEND_BASE_URL } from "../helpers/urls" 
import { RootState } from "../store" 

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, {}>
 =
async (args, api, extraOptions) => {
	let result = await fetchBaseQuery({
		baseUrl: BACKEND_BASE_URL,
		prepareHeaders: (headers, { getState }) => {
	        const authHeader = (getState() as RootState).auth.headers;
	        if (authHeader) {
		        headers.set('Authorization', authHeader)
	        }
	        return headers
	    }})(args, api, extraOptions)	
	if (result.error.status === 401){
		api.dispatch(logout())
	}
	// if (result.error){
	// 	if (result.error.status === 403) {
	// 		// TODO: implement refresh token
	// 		api.dispatch(logout())
	// 	}
	// }
	return result
}
