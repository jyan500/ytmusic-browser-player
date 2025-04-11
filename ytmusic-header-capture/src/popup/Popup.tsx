import React, { useEffect, useState } from "react"
import "../assets/tailwind.css"
import axios from "axios"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"
import { useLoginMutation } from "../services/public/auth"
import { setUserProfile } from "../slices/userProfileSlice"
import { BackendErrorMessage } from "../components/BackendErrorMessage"
import { UserProfile } from "../types/common"

export const Popup = () => {
	const [login, {isLoading, error}] = useLoginMutation()
	const dispatch = useAppDispatch()
	const { headers } = useAppSelector((state) => state.auth) 
	const { userProfile } = useAppSelector((state) => state.userProfile)

	useEffect(() => {
		if (!headers && !userProfile){
			authenticate()
		}
	}, [])

	const authenticate = async () => {
		const res = await chrome.storage.local.get("ytMusicHeaders")
		if (res){
			try {
				const response = await login({headers: JSON.stringify(res.ytMusicHeaders)}).unwrap()
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
        	{isLoading && userProfile ? <p>Loading...</p> : <p>Authenticated {userProfile?.accountName}</p>}
        </div>
    );
}

