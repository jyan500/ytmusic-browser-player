export interface UserProfile {
	accountName: string
    channelHandle: string 
    accountPhotoUrl: string
}

export interface CustomError {
	data: Record<string, Array<string>>
	status: number
}

/* UNUSED, since this project sticks to CustomError, but necessary to avoid typescript error */
export interface SerializedError {
	name?: string
	message?: string
	stack?: string
	code?: string
}
