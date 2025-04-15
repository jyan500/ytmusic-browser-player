import React, { useEffect, useState } from "react"
import "../assets/tailwind.css"
import axios from "axios"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"
import { useLoginMutation } from "../services/public/auth"
import { setUserProfile } from "../slices/userProfileSlice"
import { setCredentials } from "../slices/authSlice"
import { BackendErrorMessage } from "../components/BackendErrorMessage"
import { UserProfile } from "../types/common"
import { PlaylistContainer } from "../components/PlaylistContainer"

export const Popup = () => {
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
        <div className='h-screen flex flex-col justify-center items-center text-center bg-slate-200 text-5xl'>
        	<BackendErrorMessage error={error}/>
        	{isLoading && !userProfile && !headers ? <p>Loading...</p> : 
        	<div className = "overflow-y-scroll">
	        	Authenticated {userProfile?.accountName}
	        	<PlaylistContainer/>
        	</div>}
        </div>
    );
}

