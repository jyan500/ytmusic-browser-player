import React, { useEffect, useState } from "react"
import "../assets/tailwind.css"

export const Popup = () => {
	// const headers = chrome.storage.local.get("ytMusicHeaders")
	// return (
	// 	<div className = "tw-p-4 tw-font-bold">
	// 	{JSON.stringify(headers, null, 2)}
	// 	</div>
	// )
	// To show timer in the chrome extension
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
    }, [time]);

    return (
        <div className='tw-h-screen tw-flex tw-flex-col tw-justify-center tw-items-center tw-text-center tw-bg-slate-200 tw-text-5xl'>
            {time}
        </div>
    );
}

