export interface UserProfile {
	accountName: string
    channelHandle: string 
    accountPhotoUrl: string
}

export interface Thumbnail {
	url: string
	width: number
	height: number
}

export interface PlaylistInfo {
	id: string 
	privacy: string
	title: string
	thumbnails: Array<Thumbnail> 
	description: string
	author: string
	year: string
	duration: string
	duration_seconds: number
	trackCount: number
}

export interface OptionType {
	id: string
	name: string
}

export interface Track {
	videoId: string,
	title: string,
	artists: Array<OptionType>
	album: Array<OptionType>
	duration: string
	duration_seconds: number
	setVideoId: string 
	likeStatus: string
	thumbnails: Array<Thumbnail>
	isAvailable: string
	isExplicit: string
	videoType: string
	feedbackTokens: {
		add: string,
		remove: string	
	}	
}

export interface Playlist {
	playlistId: string
    title: string
    thumbnails?: Array<Thumbnail>
    description: string
    count: number
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

export interface IPagination {
	totalPages?: number;
	page?: number;
	perPage: number;
}

export interface ListResponse<T> {
	pagination: IPagination
	data: Array<T>
	additional?: Record<string, any>
}
