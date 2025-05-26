import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { UPDATE_INTERVAL } from "../helpers/constants"

const OffscreenAudio = () => {
	const audioRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
	    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	    	if (msg.debug){
	        	console.log("OFFSCREEN received message: ", msg)
	    	}
	    	if (msg.type === "PING") {
	            sendResponse({ ok: true })
	            return true
	        }
	        if (msg.type === "AUDIO_COMMAND_CONFIRMED") {
	        	const { action } = msg.payload
	            if (!audioRef.current) return

	            if (action === "play") {
	            	if (audioRef.current.src != msg.payload.url){
	            		// if (msg.payload.volume){
			            // 	audioRef.current.volume = msg.payload.volume
	            		// }
	            		// if (msg.payload.muted){
	            		// 	audioRef.current.muted = msg.payload.muted
	            		// }
		                audioRef.current.src = msg.payload.url
		            	// the reason for setting current time on play is if the user pauses
		            	// for more than 30 seconds. This causes the offscreen document to disappear,
		            	// so the src AND current time have to be reloaded 
		                if (msg.payload.currentTime){
		            		audioRef.current.currentTime = msg.payload.currentTime
		                }
	            	}
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
	            else if (action === "stop"){
	            	audioRef.current.pause()
	            	audioRef.current.src = ""
	            }
	        }
	        sendResponse({success: true}) 
	        return true
	    })

		const intervalId = setInterval(() => {
			if (audioRef.current){
				if (audioRef.current.src !== "" && !audioRef.current.paused) {
					chrome.runtime.sendMessage({
						type: 'AUDIO_PROGRESS',
						payload: {
							currentTime: audioRef.current.currentTime,
						}
					})
				}
			}
		}, UPDATE_INTERVAL)

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
