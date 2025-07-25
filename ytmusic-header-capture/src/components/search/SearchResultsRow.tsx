import React, { useState, useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks"
import { Track, SearchContent, Playlist as TPlaylist, ContainsArtists, ContainsAuthor } from "../../types/common"
import { IconVerticalMenu } from "../../icons/IconVerticalMenu"
import { SearchResultsDropdown } from "../dropdowns/SearchResultsDropdown"
import { useClickOutside } from "../../hooks/useClickOutside"
import { ImagePlayButton } from "../ImagePlayButton"
import { goTo } from "react-chrome-extension-router"
import { Artist } from "../../pages/Artist"
import { User } from "../../pages/User"
import { Album } from "../../pages/Album"
import { Playlist } from "../../pages/Playlist"
import { getThumbnail } from "../../helpers/functions"
import { ArtistDescription } from "../ArtistDescription"
import { AuthorDescription } from "../AuthorDescription"
import { useLoadPlaylist } from "../../hooks/useLoadPlaylist"
import { useLazyGetPlaylistTracksQuery, useLazyGetWatchPlaylistQuery } from "../../services/private/playlists"
import { setIsPlaying, setCurrentCardId } from "../../slices/audioPlayerSlice"
import { v4 as uuidv4 } from "uuid"
import { LoadingSpinner } from "../elements/LoadingSpinner"

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

    const dispatch = useAppDispatch()
    const [showDropdown, setShowDropdown] = useState(false)
    const menuDropdownRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const { currentTrack, isPlaying } = useAppSelector((state) => state.audioPlayer)
    const { playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const id = useRef(uuidv4())

    const onClickOutside = () => {
        setShowDropdown(false)  
    }

    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const [ triggerGetWatchPlaylistWithoutLoad, { data: watchPlaylistWithoutLoadData, error: watchPlaylistWithoutLoadError, isFetching: isWatchPlaylistWithoutLoadFetching}] = useLazyGetWatchPlaylistQuery()
    const [ triggerGetTracksWithoutLoad, { data: tracksWithoutLoadData, error: tracksWithoutLoadError, isFetching: isFetchingTracksWithoutLoad }] = useLazyGetPlaylistTracksQuery()
    const {triggerLoadPlaylist} = useLoadPlaylist()

    useEffect(() => {
        if (!isFetchingTracks && tracksData){
            // include the playlistId as audioPlaylistId for album playlists
            triggerLoadPlaylist({
                ...data,
                playlistId: data.resultType === "album" ? data.playlistId : data.browseId,
            } as TPlaylist, tracksData, true)
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
        if ("playlistId" in data){
            return isPlaying && (currentPlaylist?.playlistId === data?.playlistId)
        }
        else if ("videoId" in data){
            return isPlaying && currentTrack?.videoId === data.videoId
        }
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
            // component = <AuthorDescription content={{
            //     ...data,
            //     author: [{
            //         name: data?.author ?? "",
            //         id: null,
            //     }]
            // } as ContainsAuthor}/>
            component = <button className = "hover:underline hover:opacity-60" onClick={() => goTo(User, {channelId: data.browseId})}>{data?.author ?? ""}</button>
        }
        return (
            <div className = "flex flex-row gap-x-2">
                <p className = {`text-sm line-clamp-3 text-gray-300 truncate overflow-hidden`}>
                    {component}
                </p>
            </div>
        )
    }

    const enterPage = () => {
        if (data.resultType === "album" && "browseId" in data){
            goTo(Album, {browseId: data.browseId})
            return
        }
        else if (data.resultType === "playlist" && "browseId" in data){
            goTo(Playlist, {playlist: {
                playlistId: data.browseId ?? "",
                title: data.title ?? "",
                thumbnails: data.thumbnails,
                count: data.itemCount ?? 0,
                description: `${data?.author ?? ""} • ${data.itemCount?.toString() ?? ""} views`,
                tracks: [] as Array<Track>,
            } as TPlaylist})
            return
        }
        else if (data.resultType === "artist" && "browseId" in data){
            if (data.category === "Profiles"){
                goTo(User, {channelId: data.browseId})
                return
            }
            else {
                goTo(Artist, {browseId: data.browseId})
                return
            }
        }
    }

    const rowContent = () => {
        const title = <p className = "font-bold">{getTitle()}</p>
        return (
            <div className = "truncate">
                {
                    data.resultType === "album" || data.resultType === "playlist" || data.resultType === "artist" ? (<button onClick={() => enterPage()} className="hover:underline hover:opacity-60">{title}</button>) : (<div>{title}</div>)   
                }
                {getDescription()}
            </div>
        )
    }

    const loadDropdownContent = () => {
        if ("videoId" in data){
            triggerGetWatchPlaylistWithoutLoad({videoId: data.videoId ?? ""})
        } 
        if (data.resultType === "album" || data.resultType === "playlist"){
            const playlistId = data.resultType === "playlist" ? (data.browseId ?? "") : (data.playlistId ?? "")
            triggerGetTracksWithoutLoad({playlistId: playlistId, params: {}})
        }
        return
    }

    const canDropdownDisplay = () => {
        if ("videoId" in data){
            return !isWatchPlaylistWithoutLoadFetching
        }
        else if (data.resultType === "album" || data.resultType === "playlist"){
            return !isFetchingTracksWithoutLoad
        }
        return false
    }

    const constructPlaylistForDropdown = () => {
        if ((data.resultType === "playlist" || data.resultType === "album") && !isFetchingTracksWithoutLoad && tracksWithoutLoadData){
            // include the playlistId as audioPlaylistId for album playlists
            return {
                ...data,
                playlistId: data.resultType === "album" ? data.playlistId : data.browseId,
                tracks: tracksWithoutLoadData,
            } as TPlaylist
        }

        if ("videoId" in data && !isWatchPlaylistWithoutLoadFetching && watchPlaylistWithoutLoadData){
            // don't need to load further suggested tracks
            return {
                playlistId: watchPlaylistWithoutLoadData.playlistId,   
                thumbnails: [],
                title: watchPlaylistWithoutLoadData.title,
                count: watchPlaylistWithoutLoadData.tracks.length,
                description: "",
                tracks: watchPlaylistWithoutLoadData.tracks
            } as TPlaylist
        }
        return {} as TPlaylist
    }

    const triggerLoadContent = () => {
        if ("videoId" in data){
            if (currentTrack?.videoId === data.videoId){
                dispatch(setIsPlaying(!isPlaying))
            }
            else {
                triggerGetWatchPlaylist({videoId: data.videoId ?? ""})
            }
            dispatch(setCurrentCardId(id.current))
            return
        }
        if (data.resultType === "album" || data.resultType === "playlist"){
            if ( 
                currentPlaylist && ((data.playlistId != null && currentPlaylist?.playlistId === data.playlistId) || 
                (data.browseId != null && currentPlaylist?.playlistId === data.browseId))){
                dispatch(setIsPlaying(!isPlaying)) 
            }
            else {
                const playlistId = data.resultType === "playlist" ? (data.browseId ?? "") : (data.playlistId ?? "")
                triggerGetTracks({playlistId: playlistId, params: {}})
            }
            dispatch(setCurrentCardId(id.current))
            return
        }
        if (data.resultType === "artist"){
            if (data.category === "Artists"){
                goTo(Artist, {browseId: data.browseId ?? ""}) 
                return
            }   
            else if (data.category === "Profiles"){
                goTo(User, {channelId: data.browseId ?? ""})
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
                    <div className = "w-24 h-16">
                        {
                            canPlay ? (
                                <ImagePlayButton 
                                    id={id.current}
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
                                    <img loading="lazy" className={`w-full h-full object-fill`} src = {thumbnail}/>
                                </button>
                            ) 
                        }
                    </div>
                    <div className = "py-1 flex flex-col gap-y-2 items-start w-4/6">
                        {rowContent()}
                    </div>
                </div>
                {
                    "videoId" in data || data.resultType === "album" || data.resultType === "playlist" ? 
                    <div className = "relative pr-2 w-12 flex-shrink-0 flex justify-end items-center">
                        <p className = {`absolute ${showDropdown || (isFetchingTracksWithoutLoad || isWatchPlaylistWithoutLoadFetching) ? "invisible" : "group-hover:invisible"}`}>{data?.duration ?? ""}</p>
                        <button ref={buttonRef} onClick={() => {
                            setShowDropdown(!showDropdown)
                            loadDropdownContent()
                        }} className={`hover:opacity-60 ${!isWatchPlaylistWithoutLoadFetching && !isFetchingTracksWithoutLoad ? "invisible group-hover:visible" : ""} absolute`}>
                            {isWatchPlaylistWithoutLoadFetching || isFetchingTracksWithoutLoad ? <LoadingSpinner width={"w-3"} height={"h-3"}/> : <IconVerticalMenu/>}
                        </button>
                        {
                            canDropdownDisplay() ? 
    	                    <SearchResultsDropdown 
                                showDropdown={showDropdown} 
                                videoId={data.videoId ?? ""} 
                                ref={menuDropdownRef} 
                                closeDropdown={() => setShowDropdown(false)}
                                playlist={constructPlaylistForDropdown()}
                            />
                            : null
    	                }
                    </div> : null
                }
        </li>
	)	
}
