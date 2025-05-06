import React from "react"
import { IconPause } from "../icons/IconPause"
import { IconPlay } from "../icons/IconPlay"
import { IconAlert } from "../icons/IconAlert"

export interface Props {
    imageHeight: string
    imageWidth: string
    isAvailable?: boolean
    playButtonWidth: string
    playButtonHeight: string
    imageURL: string
    onPress: () => void
    showPlayButton: boolean
}

export const ImagePlayButton = ({
    imageHeight, 
    imageWidth, 
    playButtonWidth, 
    isAvailable = true,
    playButtonHeight, 
    imageURL, 
    onPress, 
    showPlayButton
}: Props) => {
    return (
        <div className = {`${imageWidth} ${imageHeight} overflow-hidden relative`}>
            {
                isAvailable ? 
                    <img loading="lazy" className = {`${imageWidth} ${imageHeight} object-cover`} src = {imageURL}/> :
                    <div className = {`flex flex-col items-center justify-center ${imageHeight} ${imageHeight} bg-gray-300`}>
                        <span className="text-xl text-dark">
                            <IconAlert/>
                        </span>
                        <span className = "text-xs text-dark">Unavailable</span>
                    </div>
            }
            {
                isAvailable ?  
                <div className = "absolute flex justify-center items-center inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    <button onClick={onPress}>
                    {
                        showPlayButton ? 
                        <IconPause className={`${playButtonWidth} ${playButtonHeight} text-white`}/> :
                        <IconPlay className={`${playButtonWidth} ${playButtonHeight} text-white`}/>
                    }
                    </button>
                </div> : null
            }
        </div>
    )
}

