import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

const OffscreenAudio = () => {
	const audioRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
	    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	        if (msg.type === "AUDIO_COMMAND_CONFIRMED") {
	        	const { action } = msg.payload
	            if (!audioRef.current) return

	            if (action === "play") {
	                audioRef.current.src = msg.payload.url
	                audioRef.current.play()
	            } 
	            else if (action === "resume"){
	            	audioRef.current.play()
	            }
	            else if (action === "pause") {
	                audioRef.current.pause()
	            }
	            else if (action === "restart"){
	            	audioRef.current.currentTime = 0
	            	if (!audioRef.current.src){
	            		audioRef.current.src = msg.payload.url
	            	}
	            	audioRef.current.play()
	            }
	            else if (action === "setTime"){
	            	audioRef.current.currentTime = msg.payload.currentTime
	            }
	            else if (action === "setVolume"){
	            	audioRef.current.volume = msg.payload.volume
	            	audioRef.current.muted = msg.payload.muted
	            }
	        }
	        sendResponse({success: true}) 
	        return true
	    })

		const intervalId = setInterval(() => {
			if (audioRef.current){
				if (!audioRef.current.paused) {
					chrome.runtime.sendMessage({
						type: 'AUDIO_PROGRESS',
						payload: {
							currentTime: audioRef.current.currentTime,
						}
					})
				}
			}
		}, 500)

	    return () => clearInterval(intervalId);

	}, [])

	useEffect(() => {
		const currentAudioRef = audioRef.current
		if (currentAudioRef){
			currentAudioRef.onended = () => {
				chrome.runtime.sendMessage({
					type: "AUDIO_ENDED",
					payload: {
					}
				})
			}	
		}
		return () => {
			if (currentAudioRef){
				currentAudioRef.onended = null
			}
		}
	}, [audioRef])


	const onLoadedMetadata = () => {
		if (audioRef?.current){
			chrome.runtime.sendMessage({
	            type: "AUDIO_LOADED",
	            payload: {
	            	duration: audioRef?.current?.duration
	            }
	        })
		}
	}

	return (
		<audio onLoadedMetadata={onLoadedMetadata} ref={audioRef}/>
	)	
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
	<OffscreenAudio/>
);
