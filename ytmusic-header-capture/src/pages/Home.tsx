import React, { useEffect, useState } from "react"
import axios from "axios"
import { Playlists } from "./Playlists"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"
import { useLoginMutation } from "../services/public/auth"
import { setUserProfile } from "../slices/userProfileSlice"
import { setCredentials } from "../slices/authSlice"
import { BackendErrorMessage } from "../components/BackendErrorMessage"
import { UserProfile } from "../types/common"
import {
	Link,
} from 'react-chrome-extension-router';
import { Avatar } from "../components/elements/Avatar"

export const Home = () => {
	const [login, {isLoading, error}] = useLoginMutation()
	const dispatch = useAppDispatch()
	const { headers } = useAppSelector((state) => state.auth) 
	const { userProfile } = useAppSelector((state) => state.userProfile)

	useEffect(() => {
		// if (!headers && !userProfile){
		// 	authenticate()
		// }
		authenticate()
	}, [])

	const authenticate = async () => {
		const res = await chrome.storage.local.get("ytMusicHeaders")
		if (res){
			try {
				const response = await login({headers: JSON.stringify(res.ytMusicHeaders)}).unwrap()
				dispatch(setCredentials({headers: JSON.stringify(res.ytMusicHeaders)}))
				dispatch(setUserProfile({userProfile: {
					accountName: response.accountName,
				    channelHandle: response.channelHandle,
				    accountPhotoUrl: response.accountPhotoUrl
				} as UserProfile}))
			}
			catch (e){

			}
		}
	}

    return (
        <div>
	        <BackendErrorMessage error={error}/>
        	{isLoading && !userProfile && !headers ? <p>Loading...</p> : 
        	<div className = "text-xl flex flex-col gap-y-2">
	        	Authenticated
	        	<div className = "flex flex-row items-center gap-x-2">
	        		<Avatar className = "w-6 h-6 rounded-full" imageUrl={userProfile?.accountPhotoUrl}/>
		        	<p>{userProfile?.accountName}</p>
	        	</div>
        		<Link component={Playlists}>
        			See Playlists
			    </Link>
        	</div>}
        </div>
    );
}

