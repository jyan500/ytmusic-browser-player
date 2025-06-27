import React, { useEffect, useState } from "react"
import axios from "axios"
import { Playlists } from "./Playlists"
import { useAppSelector, useAppDispatch } from "../hooks/redux-hooks"
import { useLoginMutation } from "../services/public/auth"
import { setUserProfile } from "../slices/userProfileSlice"
import { setCredentials, logout } from "../slices/authSlice"
import { BackendErrorMessage } from "../components/BackendErrorMessage"
import { UserProfile, HomeContent } from "../types/common"
import { useLazyGetHomeQuery }  from "../services/private/home"
import {
	Link,
} from 'react-chrome-extension-router';
import { Avatar } from "../components/elements/Avatar"
import { SuggestedContentContainer } from "../components/SuggestedContentContainer"
import { LoadingSpinner } from "../components/elements/LoadingSpinner"
import { addToast } from "../slices/toastSlice"
import { v4 as uuidv4 } from "uuid"
import { AutoCompleteSearch } from "../components/search/AutoCompleteSearch"
import { SearchResults as SearchResultsPage } from "./SearchResults"

export const Home = () => {
	const [login, {isLoading, error}] = useLoginMutation()
	const dispatch = useAppDispatch()
	const { headers } = useAppSelector((state) => state.auth) 
	const { userProfile } = useAppSelector((state) => state.userProfile)
    const [ trigger, { data: homeData, error: getHomeError, isFetching: isGetHomeFetching }] = useLazyGetHomeQuery();

	useEffect(() => {
		authenticate()
	}, [])

	useEffect(() => {
		if (!isLoading && !error && headers && userProfile){
			trigger({}, true)
		}
	}, [isLoading, headers, userProfile])

	const authenticate = async () => {
		const fallbackHeaders = await chrome.storage.local.get("ytMusicHeaders")
		if (headers){
			try {
				const response = await login({headers}).unwrap()
				if (!headers){
					dispatch(setUserProfile({userProfile: {
						accountName: response.accountName,
					    channelHandle: response.channelHandle,
					    accountPhotoUrl: response.accountPhotoUrl
					} as UserProfile}))
				}
				return
			}
			catch (e){
				// if the login fails, clear out the headers as they are likely expired
				dispatch(logout())
			}
		}
		if (fallbackHeaders?.ytMusicHeaders){
			try {
				const fallback = JSON.stringify(fallbackHeaders.ytMusicHeaders)	
				const response = await login({ headers: fallback }).unwrap()
				dispatch(setCredentials({ headers: fallback }))
				dispatch(setUserProfile({
					userProfile: {
						accountName: response.accountName,
						channelHandle: response.channelHandle,
						accountPhotoUrl: response.accountPhotoUrl,
					} as UserProfile
				}))
				return
			}
			catch (e){

			}
		}
		dispatch(addToast({
			id: uuidv4(),
			message: "Please open music.youtube.com to reauthenticate",
			animationType: "animation-in"
		}))
	}

    return (
        <div>
	        <BackendErrorMessage error={error}/>
        	{isLoading && !userProfile && !headers ? <p>Loading...</p> : 
        	<div className = "flex flex-col gap-y-2">
	        	<div className = "flex flex-row items-center gap-x-2">
	        		<Avatar className = "w-6 h-6 rounded-full" imageUrl={userProfile?.accountPhotoUrl}/>
		        	<p className = "text-xl">{userProfile?.accountName}</p>
	        	</div>
        		<Link className = "text-xl" component={Playlists}>
        			See Playlists
			    </Link>
    			<AutoCompleteSearch/>
			    {
			    	!isGetHomeFetching && homeData ? (
			    		<div className = "flex flex-col gap-y-2">
			    			{
			    				homeData?.map((content: HomeContent) => (
			    					<SuggestedContentContainer content={content}/>
			    				))
			    			}
			    		</div>
			    	) : <LoadingSpinner/> 
			    }
        	</div>
		    }
        </div>
    );
}

