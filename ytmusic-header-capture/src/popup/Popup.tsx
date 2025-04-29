import React, { useEffect, useState } from "react"
import { AudioPlayer } from "../components/audio/AudioPlayer"
import { QueuedTrackList } from "../components/audio/QueuedTrackList"
import "../assets/tailwind.css"
import "../assets/customize-progress-bar.css"
import {
	Router,
} from 'react-chrome-extension-router';
import { Home } from "../pages/Home"
import { PADDING_AVOID_AUDIO_PLAYER_OVERLAP } from "../helpers/constants"

export const Popup = () => {
    return (
        <>
        <div className={`bg-dark-secondary relative text-white p-2 w-full ${PADDING_AVOID_AUDIO_PLAYER_OVERLAP} min-h-[800px]`}>
        	<Router>
        		<Home/>	
        	</Router>
            <QueuedTrackList/>
        </div>
        <AudioPlayer/>
        </>
    );
}

