import React, { useState, useEffect } from "react"
import { useAppSelector } from "../hooks/redux-hooks"
import { IconPause } from "../icons/IconPause"
import { IconPlay } from "../icons/IconPlay"
import { IconAlert } from "../icons/IconAlert"
import { IconVerticalMenu } from "../icons/IconVerticalMenu"
import { PlaceholderThumbnail } from "./elements/PlaceholderThumbnail"
import { LoadingSpinner } from "./elements/LoadingSpinner"

export interface Props {
    id: string,
    imageHeight: string
    imageWidth: string
    isAvailable?: boolean
    playButtonWidth: string
    playButtonHeight: string
    imageURL: string
    onPress: () => void
    showPauseButton: boolean
    dropdownContentFinishedLoading?: boolean
    showVerticalMenu?: () => React.ReactNode
}

export const ImagePlayButton = ({
    id,
    imageHeight, 
    imageWidth, 
    playButtonWidth, 
    isAvailable = true,
    playButtonHeight, 
    imageURL, 
    onPress, 
    showPauseButton,
    dropdownContentFinishedLoading=true,
    showVerticalMenu,
}: Props) => {
    const { currentCardId, isLoading } = useAppSelector((state) => state.audioPlayer)

    const centerDisplay = () => {
        const mainButton = (
            <button onClick={onPress}>
            {
                showPauseButton ? 
                <IconPause className={`${playButtonWidth} ${playButtonHeight} text-white`}/> :
                <IconPlay className={`${playButtonWidth} ${playButtonHeight} text-white`}/>
            }
            </button>
        )
        return mainButton
    }

    const overlay = () => {
        return (
            // if we're loading the current card
            currentCardId !== "" && id === currentCardId ? (
                <div className = "absolute flex justify-center items-center inset-0 bg-black/50 opacity-100">
                    <LoadingSpinner width={"w-4"} height={"h-4"}/>
                </div>
            ) : (
                isAvailable ? 
                    <div className = {`absolute flex justify-center items-center inset-0 ${dropdownContentFinishedLoading ? "bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" : "opacity-100"}`}>
                        { dropdownContentFinishedLoading ? centerDisplay() : null }
                        {
                            // showVerticalMenu && onPressVerticalMenu ? 
                            // <button onClick={onPressVerticalMenu} className = "absolute top-0 right-0 mr-0.5 mt-1"><IconVerticalMenu className = {"h-6 w-6 text-gray-300"}/></button>
                            // : null
                            showVerticalMenu ? showVerticalMenu() : null
                        }
                    </div>
                : null
            )
        )
    }

    return (
        <div className = {`${imageWidth} ${imageHeight} overflow-hidden relative`}>
            {
                isAvailable ? 
                    (
                        imageURL ? 
                            <img loading="lazy" className = {`${imageWidth} ${imageHeight} object-fill`} src = {imageURL}/> :
                            <PlaceholderThumbnail className = {`${imageWidth} ${imageHeight}`}/>
                    ) :
                    <div className = {`flex flex-col items-center justify-center ${imageHeight} ${imageHeight} bg-gray-300`}>
                        <span className="text-xl text-dark">
                            <IconAlert/>
                        </span>
                        <span className = "text-xs text-dark">Unavailable</span>
                    </div>
            }
            {
               overlay() 
            }
        </div>
    )
}

