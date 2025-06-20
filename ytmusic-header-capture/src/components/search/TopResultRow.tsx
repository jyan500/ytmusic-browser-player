import React from "react"
import { ContainsArtists, SearchContent } from "../../types/common"
import { getThumbnail } from "../../helpers/functions"
import { LinkableDescription } from "../LinkableDescription"
import { ArtistDescription } from "../ArtistDescription"
import { IconPlay } from "../../icons/IconPlay"
import { IconAddToPlaylist } from "../../icons/IconAddToPlaylist"

interface Props {
	resultType: string
	data: SearchContent
}

export const TopResultRow = ({resultType, data}: Props) => {

	const getDescription = () => {
		if ("artists" in data){
			return <ArtistDescription content={data as ContainsArtists}/>
		}
		return <></>
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
                    	{data.title}
                    </h2>
                    <p className="text-sm text-gray-400">
                    	<LinkableDescription description={getDescription()}/>
                    </p>
                </div>
                <button className="flex flex-row gap-x-2 items-center bg-white text-black px-3 py-1 rounded-md"><IconPlay className = "w-3 h-3 text-dark"/><p className = "font-semibold">Play</p></button>
                <button className="flex flex-row gap-x-2 items-center bg-white text-black px-3 py-1 rounded-md"><IconAddToPlaylist className = "w-3 h-3 text-dark"/><p className = "font-semibold">Save</p></button>
            </div>
        </div>
	)
}