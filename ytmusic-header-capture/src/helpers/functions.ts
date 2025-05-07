import { QueueItem, Track, Thumbnail, ContentWithThumbnail } from "../types/common"
import { v4 as uuidv4 } from "uuid"

/* Takes the current time in seconds and returns formatted time in hh:mm:ss */
export const formatTime = (time: number | undefined): string => {
	if (typeof time === "number" && !isNaN(time)){
		// 3600 seconds in one hour
		let remainingTime = time
		const hours = Math.floor(time/3600)
		remainingTime = remainingTime - (hours * 3600)
		const minutes = Math.floor(remainingTime/60)
		remainingTime = remainingTime - (minutes * 60)
		// remaining time should be in seconds
		const seconds = Math.floor(remainingTime)
		const formatHours = hours.toString().padStart(2, "0")
		const formatMinutes = minutes.toString().padStart(2, "0")
		const formatSeconds = seconds.toString().padStart(2, "0")
		const res = `${time >= 3600 ? `${formatHours}:` : ""}${formatMinutes}:${formatSeconds}`
		return res
	}	
	return "00:00"
}

/* 
Fisher-Yates Shuffle Algorithm creates a copy of the original list, shuffles the copy and returns 
the copy 
*/
export const shuffle = (elementList: Array<any>) => {
	let array = [...elementList]
	for (let i = array.length - 1; i > 0; i--) { 
	    // Generate random index 
	    const j = Math.floor(Math.random() * (i + 1));
	    // Swap elements at indices i and j
	    const temp = array[i];
	    array[i] = array[j];
	    array[j] = temp;
	}
	return array
}

/* get number between two ranges of numbers */
export const randRange = (min: number, max: number) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Takes an array of tracks and prepares them as queue items by removing unavailable tracks and setting a queue id */
export const prepareQueueItems = (tracks: Array<Track>) => {
	return tracks.filter((track) => track.isAvailable).map((track) => {
		return (
			{
				...track,
				queueId: uuidv4(),
			}
		)
	})
}

/* Takes an object that contains a thumbnails attribute, and retrieves the largest thumbnail from the list */
export const getThumbnailUrl = (obj: ContentWithThumbnail) => {
    const widths = obj?.thumbnails?.map((thumbnail: Thumbnail) => thumbnail.width) ?? []
    const biggestWidth = Math.max(...widths)
    return obj?.thumbnails?.find((thumbnail: Thumbnail) => thumbnail.width === biggestWidth)?.url ?? ""
}
