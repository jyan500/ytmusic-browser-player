import React, { useState, useEffect } from "react"
import { useAppDispatch } from "../../hooks/redux-hooks"
import { ContainsArtists, SearchContent, Playlist as TPlaylist } from "../../types/common"
import { getThumbnail } from "../../helpers/functions"
import { LinkableDescription } from "../LinkableDescription"
import { ArtistDescription } from "../ArtistDescription"
import { IconPlay } from "../../icons/IconPlay"
import { IconAddToPlaylist } from "../../icons/IconAddToPlaylist"
import { useLazyGetWatchPlaylistQuery, useLazyGetPlaylistTracksQuery }  from "../../services/private/playlists"
import { Artist } from "../../pages/Artist"
import { User } from "../../pages/User"
import { useLoadPlaylist } from "../../hooks/useLoadPlaylist"
import { setIsOpen, setModalType, setModalProps } from "../../slices/modalSlice"
import { goTo } from "react-chrome-extension-router"
import { PillButton } from "../elements/PillButton"

interface Props {
	resultType: string
	data: SearchContent
}

export const TopResultRow = ({resultType, data}: Props) => {
	const dispatch = useAppDispatch()
	const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const {triggerLoadPlaylist} = useLoadPlaylist()

    useEffect(() => {
        if (!isFetchingTracks && tracksData){
            // include the playlistId as audioPlaylistId for album playlists
            triggerLoadPlaylist({
                ...data,
                playlistId: data.resultType === "album" ? data.playlistId : data.browseId,
            } as TPlaylist, tracksData)
        }
    }, [tracksData, isFetchingTracks])

    useEffect(() => {
        if (!isWatchPlaylistFetching && watchPlaylistData){
            // don't need to load further suggested tracks
            triggerLoadPlaylist({
                playlistId: watchPlaylistData.playlistId,   
                thumbnails: [],
                title: watchPlaylistData.title,
                count: watchPlaylistData.tracks.length,
                description: "",
                tracks: watchPlaylistData.tracks
            } as TPlaylist, watchPlaylistData.tracks, false)
        }
    }, [watchPlaylistData, isWatchPlaylistFetching])

    const getTitle = () => {
        if (data.resultType === "artist"){
            return <ArtistDescription content={data as ContainsArtists}/>
        }
        if ("title" in data){
            return <>{data.title ?? ""}</>
        }
        return <></>
    }

    const getDescription = () => {
    	let component;
        if ("artists" in data) {
            component = <ArtistDescription content={{...data, artists: data.resultType === "artist" ? [{
            	id: null,
            	name: `${data.subscribers ?? ""} monthly audience`
            }] : data.artists} as ContainsArtists}/>
        } 
        else if ("author" in data){
            // component = <AuthorDescription content={{
            //     ...data,
            //     author: [{
            //         name: data?.author ?? "",
            //         id: null,
            //     }]
            // } as ContainsAuthor}/>
            component = <>{data?.author ?? ""}</>
        }
        return component
    }

	const onPlay = () => {
		if ("videoId" in data && data.resultType !== "album"){
			triggerGetWatchPlaylist({videoId: data.videoId ?? ""})
		}
		else if ("playlistId" in data){
			triggerGetTracks({playlistId: data.playlistId ?? "", params: {}})
		}
	}

	const onAddToPlaylist = () => {
		dispatch(setModalType("add-to-playlist"))
		dispatch(setIsOpen(true))
		dispatch(setModalProps({videoId: data.videoId}))
	}

	const buttonBar = () => {
		if (data.resultType === "artist") {
			return (
                <PillButton onClick={() => goTo(Artist, {browseId: data.browseId ?? ""})} text={"See More"}/>
			)
		}
		if ("videoId" in data || "playlistId" in data){
			return (
				<>
                    <PillButton onClick={onPlay} text={"Play"}>
                        <IconPlay className = "w-3 h-3 text-dark"/>  
                    </PillButton>
                    <PillButton onClick={onAddToPlaylist} text={"Save"}>
                        <IconAddToPlaylist className = "w-3 h-3 text-dark"/> 
                    </PillButton>
		        </>
			)		
		}
	}

	return (
		<div className="relative bg-linear-to-bl from-black to-dark text-white p-4 w-full overflow-hidden rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
                <img
                    src={getThumbnail(data)?.url ?? ""}
                    alt="Thumbnail"
                    className="w-20 h-20 object-cover rounded"
                />
                <div className="w-3/4 truncate">
    			    <h2 className="text-lg font-bold">
                    	{getTitle()}
                    </h2>
                    <p className={`text-sm text-gray-400`}>
                    	<LinkableDescription description={getDescription()}/>
                    </p>
                </div>
                {buttonBar()}
            </div>
        </div>
	)
}
