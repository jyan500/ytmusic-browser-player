import React, { useEffect, useState } from "react"
import "../assets/tailwind.css"
import {
	Router,
} from 'react-chrome-extension-router';
import { Home } from "../pages/Home"

export const Popup = () => {
    return (
        <div className='p-2 w-full'>
        	<Router>
        		<Home/>	
        	</Router>
        </div>
    );
}

