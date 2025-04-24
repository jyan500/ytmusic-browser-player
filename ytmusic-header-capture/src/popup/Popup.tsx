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
        <div className='p-2 w-full pb-[113px]'>
        	<Router>
        		<Home/>	
        	</Router>
        </div>
        <AudioPlayer/>
        </>
    );
}

