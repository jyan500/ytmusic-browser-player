import React from "react"
import { IconPause } from "../icons/IconPause"
import { IconPlay } from "../icons/IconPlay"

export interface Props {
    imageHeight: string
    imageWidth: string
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
    playButtonHeight, 
    imageURL, 
    onPress, 
    showPlayButton
}: Props) => {
    return (
        <div className = {`${imageWidth} ${imageHeight} overflow-hidden relative`}>
            <img loading="lazy" className = {`${imageWidth} ${imageHeight} object-cover`} src = {imageURL}/> 
            <div className = "absolute flex justify-center items-center inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                <button onClick={onPress}>
                {
                    showPlayButton ? 
                    <IconPause className={`${playButtonWidth} ${playButtonHeight} text-white`}/> :
                    <IconPlay className={`${playButtonWidth} ${playButtonHeight} text-white`}/>
                }
                </button>
            </div>
        </div>
    )
}

