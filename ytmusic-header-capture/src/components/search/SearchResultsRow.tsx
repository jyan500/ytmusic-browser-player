import React, { useState, useEffect, useRef } from "react"
import { SearchContent, Playlist as TPlaylist, ContainsArtists, ContainsAuthor } from "../../types/common"
import { IconVerticalMenu } from "../../icons/IconVerticalMenu"
import { SearchResultsDropdown } from "../dropdowns/SearchResultsDropdown"
import { useClickOutside } from "../../hooks/useClickOutside"
import { ImagePlayButton } from "../ImagePlayButton"
import { goTo } from "react-chrome-extension-router"
import { Artist } from "../../pages/Artist"
import { User } from "../../pages/User"
import { getThumbnail } from "../../helpers/functions"
import { ArtistDescription } from "../ArtistDescription"
import { AuthorDescription } from "../AuthorDescription"
import { useLoadPlaylist } from "../../hooks/useLoadPlaylist"
import { useLazyGetPlaylistTracksQuery, useLazyGetWatchPlaylistQuery } from "../../services/private/playlists"

interface Props {
    data: SearchContent 
	key: string
	thumbnail: string
    canPlay: boolean
}

export const SearchResultsRow = ({
    data,
	key, 
    canPlay=true,
	thumbnail
}: Props) => {

    const [showDropdown, setShowDropdown] = useState(false)
    const menuDropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const onClickOutside = () => {
        setShowDropdown(false)  
    }

    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const {triggerLoadPlaylist} = useLoadPlaylist()

    useEffect(() => {
        if (!isFetchingTracks && tracksData && data.playlistId){
            // include the playlistId as audioPlaylistId for album playlists
            triggerLoadPlaylist({
                ...data,
                playlistId: data.playlistId,
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

    const showPauseButton = () => {
        return false
    }

    const getTitle = () => {
        if ("artist" in data){
            return data.artist ?? ""
        }
        if ("title" in data){
            return data.title ?? ""
        }
        return ""
    }

    const getDescription = () => {
        let component: React.ReactNode = <></>
        if ("artists" in data) {
            component = <ArtistDescription content={data as ContainsArtists}/>
        } 
        else if ("author" in data){
            component = <AuthorDescription content={{
                ...data,
                author: [{
                    name: data?.author ?? "",
                    id: data?.browseId ?? "",
                }]
            } as ContainsAuthor}/>
        }
        return (
            <div className = "flex flex-row gap-x-2">
                <p className = {`text-sm text-gray-300 truncate overflow-hidden`}>
                    {component}
                </p>
            </div>
        )
    }

    const rowContent = () => {
        const title = <p className = "font-bold">{getTitle()}</p>
        return (
            <>
                {
                    "playlistId" in data ? (<button className="hover:underline hover:opacity-60">{title}</button>) : (<div>{title}</div>)   
                }
                {getDescription()}
            </>
        )
    }

    const triggerLoadContent = () => {
        if ("videoId" in data){
            triggerGetWatchPlaylist({videoId: data.videoId ?? ""})
        }
        if ("playlistId" in data){
            triggerGetTracks({playlistId: data.playlistId ?? "", params: {}})
        }
        if ("browseId" in data){
            if (data.category === "Artists"){
                goTo(Artist, {browseId: data.browseId}) 
                return
            }   
            else if (data.category === "Profiles"){
                goTo(User, {channelId: data.browseId})
                return
            }
        }
    }

    useClickOutside(menuDropdownRef, onClickOutside, buttonRef)

	return (
		<li 
            tabIndex={0} 
            key={key} 
            className={`relative hover:cursor-pointer group flex flex-row justify-between items-center`}>
                <div className = "flex flex-row gap-x-2">
                    {
                        canPlay ? (
                            <ImagePlayButton 
                                playButtonWidth={"w-6"}
                                playButtonHeight={"h-6"}
                                imageWidth={"w-24"}
                                imageHeight={"h-16"}
                                isAvailable={true}
                                showPauseButton={showPauseButton()}
                                onPress={() => triggerLoadContent()}
                                imageURL={thumbnail}
                            />        
                        ) : (
                            <button onClick={() => triggerLoadContent()} className = "hover:opacity-60 w-24 h-16">
                                <img loading="lazy" className={`w-24 h-16 object-fill`} src = {thumbnail}/>
                            </button>
                        ) 
                    }
                    <div className = "py-1 flex flex-col gap-y-2 truncate overflow-hidden">
                        {rowContent()}
                    </div>
                </div>
                <div className = "relative pr-2 w-12 flex-shrink-0 flex justify-end items-center">
                    <p className = {`absolute ${showDropdown ? "invisible" : "group-hover:invisible"}`}>{data?.duration ?? ""}</p>
                    <button ref={buttonRef} onClick={() => {
                        setShowDropdown(!showDropdown)}
                    } className="hover:opacity-60 invisible group-hover:visible absolute">
                        <IconVerticalMenu/>
                    </button>
                    {
                    showDropdown ? 
	                    <SearchResultsDropdown ref={menuDropdownRef} closeDropdown={() => setShowDropdown(false)}/>
	                    : null
	                }
                </div>
        </li>
	)	
}
