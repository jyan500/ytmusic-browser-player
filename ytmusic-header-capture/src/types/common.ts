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

export type ContentWithThumbnail = {
	thumbnails?: Array<Thumbnail>
} & {
	[key: string]: any
}

export interface PlaybackInfo {
	videoId: string
	playbackURL: string
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
	album: OptionType
	length?: string
	duration?: string
	duration_seconds?: number
	setVideoId?: string 
	likeStatus: string
	thumbnails: Array<Thumbnail>
	thumbnail?: Array<Thumbnail>
	isAvailable?: boolean
	isExplicit?: boolean 
	videoType: string
	feedbackTokens?: {
		add?: string,
		remove?: string	
	}	
}

export type QueueItem = Track & {
	queueId: string
} 

export interface Playlist {
	playlistId: string
    title: string
    thumbnails?: Array<Thumbnail>
    description: string
    count: number
}

export type WatchPlaylist = {
	playlistId: string
	related: string
	tracks: Array<Track>
	title: string
}

export interface Album {
	title: string
	type: string
	thumbnails: Array<Thumbnail>
	description?: string 
	artists: Array<OptionType>
	year?: string
	trackCount?: number 
	duration?: string
	audioPlaylistId: string
	tracks: Array<Track>
    other_versions?: Array<Track>
	duration_seconds?: string
}

export interface Song {
    streamingData: {
        expiresInSeconds: string
        adaptiveFormats: [
            {
                itag: number
                url: string
                mimeType: string
                bitrate: number
                initRange: {
                    start: string
                    end: string
                },
                indexRange: {
                    start: string
                    end: string
                },
                lastModified: string
                contentLength: string
                quality: string
                projectionType: string
                averageBitrate: number
                highReplication: boolean
                audioQuality: string
                approxDurationMs: string
                audioSampleRate: string
                audioChannels: number
                loudnessDb: number
            }
        ]
    }
    videoDetails: {
        videoId: string
        title: string
        lengthSeconds: string
        channelId: string
        isOwnerViewing: boolean
        isCrawlable: boolean
        thumbnail: {
            thumbnails: Array<Thumbnail>
        },
        allowRatings: boolean
        viewCount: string
        author: string
        isPrivate: boolean
        isUnpluggedCorpus: boolean
        musicVideoType: string 
        isLiveContent: boolean
    }
}

export interface ArtistContent {
	title: string
	thumbnails: Array<Thumbnail>
	year?: string
	videoId?: string	
	artist?: string
	artists?: Array<OptionType>
	album?: OptionType 
	audioPlaylistId?: string
	browseId?: string
	views?: string
	isAvailable?: boolean
	subscribers?: string
	playlistId?: string
}

export interface Artist {
	description: string
    views: string
    name: string
    channelId: string
    shuffleId: string
    radioId: string
    subscribers: string
    subscribed: boolean
    thumbnails: Array<Thumbnail>
    songs: {
    	browseId: string
    	results: Array<ArtistContent>
    }
    albums: {
        results: Array<ArtistContent>
        browseId: string 
        params: string
    }
    singles: {
        results: Array<ArtistContent>
        browseId: string
        params: string
    }
    videos: {
    	browseId: string
    	results: Array<ArtistContent>
    }
    related: {
    	results: Array<ArtistContent>
    }
}

export interface HomeContent {
	title: string
	// explore content can contain album information, song information or playlist information
	contents: Array<SuggestedContent>
}

export interface SuggestedContent {
	title?: string	
	thumbnails?: Array<Thumbnail>
	browseId?: string
	description?: string
	playlistId?: string
	videoId?: string
	year?: string
	subscribers?: string
	author?: Array<OptionType>
	artists?: Array<OptionType>
	audioPlaylistId?: string
	album?: OptionType
	views?: string
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

export type WithAttribute = {
	[key: string]: any
}

export type ComponentWithDataProp<T extends WithAttribute, P = {}> = React.FC<{ data: T[] } & P>

export type GenericPropType<T extends WithAttribute, P={}> = {
	data: Array<T>	
	props?: P
	component: ComponentWithDataProp<T, P>
}

