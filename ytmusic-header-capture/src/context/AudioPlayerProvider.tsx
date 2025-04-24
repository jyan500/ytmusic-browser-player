import React, {
	useRef,
	createContext, 
	useContext, 
	useState, 
	ReactNode, 
	Dispatch, 
	SetStateAction } from "react"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"

interface Props {
	children: ReactNode
}

interface AudioPlayerContextType {
	audioRef: React.RefObject<HTMLAudioElement | null>,
	progressBarRef: React.RefObject<HTMLInputElement | null>,
}

const AudioPlayerContext =createContext<AudioPlayerContextType | undefined>(undefined)

export const AudioPlayerProvider = ({children}: Props) => {
	const { currentTrack: currentTrack } = useAppSelector((state) => state.audioPlayer)
	const audioRef = useRef<HTMLAudioElement>(null)
	const progressBarRef = useRef<HTMLInputElement>(null)
	const contextValue = {
		audioRef,
		progressBarRef	
	}
	return (
		<AudioPlayerContext.Provider value={contextValue}>
			{children}
		</AudioPlayerContext.Provider>
	)
}

export const useAudioPlayerContext = (): AudioPlayerContextType => {
	const context = useContext(AudioPlayerContext)
	if (context === undefined){
		throw new Error("useAudioPlayerContext must be used within an AudioPlayerProvider")
	}
	return context
}
