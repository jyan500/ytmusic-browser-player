import React, { useEffect, useState } from "react"
import { AudioPlayer } from "../components/audio/AudioPlayer"
import "../assets/tailwind.css"
import "../assets/customize-progress-bar.css"
import {
	Router,
} from 'react-chrome-extension-router';
import { Home } from "../pages/Home"

export const Popup = () => {
    return (
        <>
        <div className='bg-dark-secondary text-white p-2 w-full pb-[120px] min-h-[800px]'>
        	<Router>
        		<Home/>	
        	</Router>
        </div>
        <AudioPlayer/>
        </>
    );
}

