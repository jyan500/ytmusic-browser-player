import React from "react"
import { setShowQueuedTrackList } from "../../slices/queuedTrackListSlice"
import { useAppSelector, useAppDispatch } from "../../hooks/redux-hooks"

export const QueuedTrackList = () => {
	const dispatch = useAppDispatch()
	const { showQueuedTrackList: isOpen } = useAppSelector((state) => state.queuedTrackList)
	const transition = "transform transition-transform duration-500 ease-in-out"
	return (
		<div className = {`${isOpen ? `translate-y-0`: "translate-y-full"} ${transition} absolute inset-0 bg-dark w-full h-full`}>
			<div className = "p-2">
			</div>
		</div>
	)
}