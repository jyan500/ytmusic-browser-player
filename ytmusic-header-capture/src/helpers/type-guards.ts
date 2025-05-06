import { QueueItem } from "../types/common"

export const isQueueItem = (obj: any): obj is QueueItem => {
    return obj && "queueId" in obj;
}
