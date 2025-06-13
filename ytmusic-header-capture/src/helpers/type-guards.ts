import { QueueItem, Video, Playlist } from "../types/common"

export const isQueueItem = (obj: any): obj is QueueItem => {
    return obj && "queueId" in obj;
}

export const isVideo = (obj: any): obj is Video => {
    return obj && "videoId" in obj
}

export const isPlaylist = (obj: any): obj is Playlist => {
    return obj && "playlistId" in obj
}
