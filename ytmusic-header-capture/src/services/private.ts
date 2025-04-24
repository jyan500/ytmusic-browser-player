import { BaseQueryFn, FetchArgs, createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "../store" 
import { BACKEND_BASE_URL } from "../helpers/urls" 
import { baseQueryWithReauth } from "./customQuery"
import { CustomError } from "../types/common"
import { TAG_TYPES } from "../helpers/constants"

// initialize an empty api service that we'll inject endpoints into later as needed
export const privateApi = createApi({
	reducerPath: "private",
	tagTypes: TAG_TYPES,
	baseQuery: baseQueryWithReauth as BaseQueryFn<string | FetchArgs, unknown, CustomError, {}>,	
	endpoints: () => ({}),
})
