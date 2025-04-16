import React, { useEffect, useState } from "react"
import "../assets/tailwind.css"
import {
	Router,
} from 'react-chrome-extension-router';
import { Home } from "../pages/Home"

export const Popup = () => {
    return (
        <div className='h-screen w-full text-xl'>
        	<Router>
        		<Home/>	
        	</Router>
        </div>
    );
}

