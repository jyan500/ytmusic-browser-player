import React from "react"
import { goTo } from "react-chrome-extension-router"
import { Artist } from "../pages/Artist"
import { OptionType, ContainsArtists } from "../types/common"

interface Props {
	content?: ContainsArtists | undefined | null
	closeTracklist?: () => void
}

export const ArtistDescription = ({content, closeTracklist}: Props) => {
	const onClickArtist = (artistId: string) => {
		goTo(Artist, {browseId: artistId})
		if (closeTracklist){
			closeTracklist()
		}
		return
	}
	const length = content?.artists?.length ?? 0
	return (
		<>
			{
				content?.artists?.length ? 
					content?.artists?.map((artist: OptionType, index: number) => {
						return (
							<a key={artist.id} className = {artist.id ? `hover:opacity-60 hover:underline` : ""} onClick={() => artist.id ? onClickArtist(artist.id) : {}}>{artist.name} {index !== length - 1 ? "• " : ""}</a>
						)
					}) :
				<></>
			}
		</>
	)
}