import React, { useRef, useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { ContainsArtists, ArtistContent, OptionType, Playlist as TPlaylist, Track } from "../types/common"
import { PlayableCard } from "./PlayableCard"
import { goTo } from "react-chrome-extension-router"
import { useLazyGetWatchPlaylistQuery, useLazyGetPlaylistTracksQuery, useLazyGetPlaylistQuery } from "../services/private/playlists"
import { useLazyGetRelatedTracksQuery } from "../services/private/songs"
import { useLazyGetAlbumQuery } from "../services/private/albums"
import { useLoadTrack } from "../hooks/useLoadTrack"
import { useLoadPlaylist } from "../hooks/useLoadPlaylist"
import { Playlist } from "../pages/Playlist"
import { Artist } from "../pages/Artist"
import { Album } from "../pages/Album"
import { getThumbnail } from "../helpers/functions"
import { SideScrollContent } from "./SideScrollContent"
import { LinkableDescription } from "./LinkableDescription"
import { ArtistDescription } from "./ArtistDescription"
import { setCurrentCardId } from "../slices/audioPlayerSlice"
import { IconVerticalMenu } from "../icons/IconVerticalMenu"
import { LoadingSpinner } from "./elements/LoadingSpinner"
import { PlaylistDropdown } from "./dropdowns/PlaylistDropdown"
import { useClickOutside } from "../hooks/useClickOutside"
import { v4 as uuidv4 } from "uuid"

interface Props {
	content: ArtistContent
}

export const ArtistScrollContent = ({content}: Props) => {
	const dispatch = useAppDispatch()
	const { isPlaying, currentTrack } = useAppSelector((state) => state.audioPlayer)
	const { playlist: currentPlaylist } = useAppSelector((state) => state.queuedTrackList)
    const [ triggerGetTracks, { data: tracksData, error: tracksError, isFetching: isFetchingTracks }] = useLazyGetPlaylistTracksQuery();
    const [ triggerGetRelatedTracks, { data: relatedTracksData, error: relatedTracksError, isFetching: isFetchingRelatedTracks }] = useLazyGetRelatedTracksQuery();
    const [ triggerGetWatchPlaylist, {data: watchPlaylistData, error: watchPlaylistError, isFetching: isWatchPlaylistFetching}] = useLazyGetWatchPlaylistQuery()
    const [ triggerGetWatchPlaylistWithoutLoad, {data: watchPlaylistWithoutLoadData, error: watchPlaylistWithoutLoadError, isFetching: isWatchPlaylistWithoutLoadFetching}] = useLazyGetWatchPlaylistQuery()
    const [ triggerGetAlbum, {data: albumData, error: albumError, isFetching: isAlbumFetching } ] = useLazyGetAlbumQuery()
    const [ triggerGetAlbumWithoutLoad, {data: albumDataWithoutLoad, error: albumErrorWithoutLoad, isFetching: isAlbumFetchingWithoutLoad } ] = useLazyGetAlbumQuery()
    const [ triggerGetPlaylist, { data: playlistData, error: playlistError, isFetching: isPlaylistFetching}] = useLazyGetPlaylistQuery()
    const { triggerLoadPlaylist } = useLoadPlaylist()
    const id = useRef(uuidv4())
    const [ showDropdown, setShowDropdown ] = useState(false)
	const playlistDropdownRef = useRef<HTMLDivElement | null>(null)
	const buttonRef = useRef<HTMLButtonElement | null>(null)

    useClickOutside(playlistDropdownRef, () => { setShowDropdown(false) }, buttonRef)

	const playContent = () => {
		if ("browseId" in content){
			triggerGetAlbum(content?.browseId ?? "")
		}
    	else if ("videoId" in content){
    		// get the watch playlist for this video and load as playlist
    		triggerGetWatchPlaylist({videoId: content?.videoId ?? ""})
    	}
    	else if ("audioPlaylistId" in content){
			triggerGetTracks({playlistId: "playlistId" in content ? (content.playlistId ?? "") : (content.audioPlaylistId ?? ""), params: {}})
    	}
    	dispatch(setCurrentCardId(id.current))
    }

	const getDescription = (): string => {
		if ("browseId" in content && "year" in content){
			return content?.year ?? ""
		}
		if ("subscribers" in content){
			return content?.subscribers ? `${content?.subscribers} subscribers` : "" 
		}
		if ("artists" in content){
			const artistNames = content?.artists?.map((artist: OptionType) => {
				return artist.name
			})
			if (artistNames){
				return artistNames.join(" • ")
			}
		}
		return ""
	}

	const getLinkableDescription = () => {
		if ("browseId" in content && "year" in content){
			return <>{content?.year ?? ""}</>
		}
		if ("subscribers" in content){
			return <>{content?.subscribers ? `${content?.subscribers} subscribers` : ""}</> 
		}
		if ("artists" in content){
			return <ArtistDescription content={content as ContainsArtists}/>
		}
		return <></>
	}

	const shouldShowPauseButton = () => {
		if ("playlistId" in content || "audioPlaylistId" in content){
			return isPlaying && (currentPlaylist?.playlistId === content?.playlistId || currentPlaylist?.playlistId === content?.audioPlaylistId)
		}
		else if ("videoId" in content){
			return isPlaying && currentTrack?.videoId === content?.videoId
		}
		return false 
	}

	const cardClickAction = () => {
		if ("subscribers" in content && "browseId" in content){
			goTo(Artist, {browseId: content.browseId ?? ""})
			return
    	}
    	// if it's a playlist, enter the playlist page
    	if (!("videoId" in content)){
    		if ("playlistId" in content){
    			goTo(Playlist, {playlist: content})
    			return
    		}
    		else if ("browseId" in content){
    			goTo(Album, {browseId: content.browseId})
    			return
    		}
    	}

    }

	useEffect(() => {
		if (!isFetchingTracks && tracksData){
			// include the playlistId as audioPlaylistId for album playlists
			triggerLoadPlaylist({
				...content,
				playlistId: "audioPlaylistId" in content ? content.audioPlaylistId : content.playlistId,
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
				tracks: watchPlaylistData.tracks,
			} as TPlaylist, watchPlaylistData.tracks, false)
		}
	}, [watchPlaylistData, isWatchPlaylistFetching])

	const displayDropdown = () => {
		const useWatchPlaylist = "videoId" in content && !isWatchPlaylistWithoutLoadFetching && watchPlaylistWithoutLoadData != null
		const usePlaylist = ("playlistId" in content || "audioPlaylistId" in content) && !isPlaylistFetching && playlistData != null
		const useAlbum = ("browseId" in content && !("subscribers" in content)) && !isAlbumFetchingWithoutLoad && albumDataWithoutLoad != null
		let playlistForDropdown = {} as TPlaylist
		if (useWatchPlaylist){
			playlistForDropdown = {
				playlistId:  watchPlaylistWithoutLoadData.playlistId,	
				thumbnails: [],
				title:  watchPlaylistWithoutLoadData.title,
				count:  watchPlaylistWithoutLoadData.tracks.length,
				description: "",
				tracks:  watchPlaylistWithoutLoadData.tracks
			} as TPlaylist
		}
		else if (usePlaylist){
			playlistForDropdown = {
				...playlistData,	
				author: [{id: "", name: playlistData.author} as OptionType],
				playlistId: playlistData.id,
				count: playlistData.trackCount,
			}
		}
		else if (useAlbum){
			playlistForDropdown = {
				playlistId: albumDataWithoutLoad.audioPlaylistId,
				title: albumDataWithoutLoad.title,
				author: albumDataWithoutLoad.artists,
				description: albumDataWithoutLoad.description,
				thumbnails: albumDataWithoutLoad.thumbnails,
				count: albumDataWithoutLoad.trackCount,
				owned: false,
				tracks: albumDataWithoutLoad.tracks,
			} as TPlaylist	
		}
		if (useWatchPlaylist || usePlaylist || useAlbum){
			return <PlaylistDropdown ref={playlistDropdownRef} showDropdown={showDropdown} playlist={playlistForDropdown} owned={usePlaylist ? playlistData.owned : false} closeDropdown={() => setShowDropdown(false)} />
		}
		return null
	}

	const onVerticalMenuPress = () => {
		if ("videoId" in content){
			// to avoid accidentally loading the playlist into playback, use a different trigger that makes a call to the same endpoint
			triggerGetWatchPlaylistWithoutLoad({
				videoId: content?.videoId ?? "",
			}, true)
		}
		else if ("playlistId" in content || "audioPlaylistId" in content){
			triggerGetPlaylist({
				playlistId: "audioPlaylistId" in content ? (content?.audioPlaylistId ?? "") : (content?.playlistId ?? ""), 
				params: {}}, 
			true)
		}	
		else if ("browseId" in content && !("subscribers" in content)){
			triggerGetAlbumWithoutLoad(content?.browseId ?? "")
		}
		return
	}

	const dropdownContentFinishedLoading = () => {
		if ("videoId" in content){
			return !isWatchPlaylistWithoutLoadFetching
		}
		else if ("playlistId" in content || "audioPlaylistId" in content){
			return !isPlaylistFetching
		}
		else if ("browseId" in content && !("subscribers" in content)){
			return !isAlbumFetchingWithoutLoad
		}
		return false
	}


	useEffect(() => {
		if (albumData && !isAlbumFetching){
			triggerGetTracks({playlistId: albumData.audioPlaylistId, params: {}})
		}
	}, [albumData, isAlbumFetching])

	return (
		<SideScrollContent 
			id={id.current}
			title={content.title ?? ""}
			thumbnail={getThumbnail(content)}
			description={getDescription()}
			// if the subscribers key is present, this is an artist, which isn't a playable entity
			canPlay={!("subscribers" in content)}
			cardClickAction={() => cardClickAction()}
			isCircular={"subscribers" in content}
			playContent={() => playContent()}
			linkableDescription={<LinkableDescription description={getLinkableDescription()}/>}
			showPauseButton={shouldShowPauseButton()}
			displayDropdown={() => displayDropdown()}
		    dropdownContentFinishedLoading={dropdownContentFinishedLoading()}
		    showVerticalMenu={() => {
			   	return (
				    <>
			    		{
				    		dropdownContentFinishedLoading() ? <>
		                	<button ref={buttonRef} onClick={() => {
		                		setShowDropdown(!showDropdown)	
		                		// triggerGetPlaylist({playlistId: playlist.playlistId, params: {}}, true)
		                		onVerticalMenuPress()	
		                	}} className = "absolute top-0 right-0 mr-0.5 mt-1"><IconVerticalMenu className = {"h-6 w-6 text-gray-300"}/></button>
		                	</> : <div className = "absolute top-0 right-0 mr-1 mt-1.5"><LoadingSpinner width={"w-4"} height={"h-4"}/></div>
		                }
					</>
			   )
		    }}
		>
		</SideScrollContent>
	)
}
