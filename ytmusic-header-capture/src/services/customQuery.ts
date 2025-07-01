import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import type {
	BaseQueryFn,	
	FetchArgs,
	FetchBaseQueryError
} from "@reduxjs/toolkit/query"
import { CustomError } from "../types/common"
import { BACKEND_BASE_URL } from "../helpers/urls" 
import { RootState } from "../store" 
import { logout } from "../slices/authSlice"
import { addToast } from "../slices/toastSlice"
import { v4 as uuidv4 } from "uuid"

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
	if (result.error?.status === 401){
		api.dispatch(logout())
		api.dispatch(addToast({
			id: uuidv4(),
			message: "Unable to authenticate to music.youtube.com, please refresh the page.",
			animationType: "animation-in",
		}))
	}
	return result
}
