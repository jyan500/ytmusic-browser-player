import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

const OffscreenAudio = () => {
	const audioRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
	    chrome.runtime.onMessage.addListener((msg) => {
	        if (msg.type === "AUDIO_COMMAND") {
	            const { action, url } = msg.payload
	            if (!audioRef.current) return

	            if (action === "play") {
	                audioRef.current.src = url
	                audioRef.current.play()
	            } else if (action === "pause") {
	                audioRef.current.pause()
	            }
	        }
	    })
	}, [])

	return (
		<audio ref={audioRef}/>
	)	
}

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(
	<OffscreenAudio/>
);
