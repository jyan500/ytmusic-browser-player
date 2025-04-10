import React, { useEffect, useState } from "react"
import "../assets/tailwind.css"
import axios from "axios"

export const Popup = () => {
	const [headers, setHeaders] = useState({})

	useEffect(() => {
		if (!localStorage.getItem("ytMusicHeaders")){
			console.log("could not retrieve headers...")
			chrome.storage.local.get("ytMusicHeaders").then((res) => {
				localStorage.setItem('ytMusicHeaders', JSON.stringify(res.ytMusicHeaders));
				console.log("loaded headers")
			})
		}
		else {
			console.log(localStorage.getItem("ytMusicHeaders"))	
		}
	}, [chrome.storage.local])

	const authenticate = async () => {
		if (localStorage.getItem("ytMusicHeaders")){
			// await axios.post("http://localhost:5000/authenticate", {headers: localStorage.getItem("ytMusicHeaders")})
			await axios.get("http://localhost:5001")
		}
	}

    return (
        // <div className='tw-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-center tw-bg-slate-200 tw-text-5xl'>
        //     {time}
        // </div>
        <div className='h-screen flex flex-col justify-center items-center text-center bg-slate-200 text-5xl'>
        	<button className = "border border-black rounded-md" onClick={authenticate}>Authenticate</button>
        </div>
    );
}

