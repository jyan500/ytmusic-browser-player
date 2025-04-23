import React, {useRef, useEffect} from "react"

interface Props {
	src: string
}

export const AudioPlayer = ({src}: Props) => {
	const audioRef = useRef<HTMLAudioElement | null>(null)

	useEffect(() => {
		if (audioRef?.current){
			audioRef.current.volume = 0.5
		}
	}, [])

	return (
		<div>
			<audio ref={audioRef} autoPlay controls src = {src}/>	
		</div>
	)	
}