import React, {useRef, useState, useEffect} from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks"
import { SuggestedContent, OptionType, Playlist as TPlaylist } from "../types/common"
import { CircleButton } from "./elements/CircleButton"
import { goTo } from "react-chrome-extension-router"
import { IconLeftArrow } from "../icons/IconLeftArrow"
import { IconRightArrow } from "../icons/IconRightArrow"
import { SideScrollContent } from "./SideScrollContent"
import { SuggestedContentGrid } from "./SuggestedContentGrid"

interface Props {
	title: string
	content: Array<SuggestedContent>
}

export const SideScroller = ({title, content}: Props) => {
	const scrollRef = useRef<HTMLDivElement>(null)
    const SCROLL_STEP_PERCENT = .9 // 25% of 680px = 170px per click
    const MAX_WIDTH = 680 

    const scrollState = useRef({ left: true, right: false })
    const [disabledButtons, setDisabledButtons] = useState({ left: true, right: false })

    const checkScrollBounds = () => {
        const container = scrollRef.current
        if (!container) return

        const { scrollLeft, scrollWidth, clientWidth } = container
        const canScrollLeft = scrollLeft > 0
        const canScrollRight = scrollLeft + clientWidth < scrollWidth - 1 // -1 for floating point buffer

        const prev = scrollState.current;
        if (prev.left !== canScrollLeft || prev.right !== canScrollRight){
        	scrollState.current = { left: canScrollLeft, right: canScrollRight }
        	setDisabledButtons({left: !canScrollLeft, right: !canScrollRight})
        }

    }
   
	const handleScroll = (isForward: boolean) => {
		const container = scrollRef.current	
		if (!container){
			return
		}
		const scrollAmount = MAX_WIDTH * SCROLL_STEP_PERCENT
        const maxScrollLeft = container.scrollWidth - container.clientWidth
        // 1) when scrolling right, we add the scroll amount to the current scroll position, and take the min between
        // the max possible scroll position and our current to make sure it doesn't exceed the right boundary
        // 2) when scrolling left, we subtract the scroll amount from the current position, and take the max between
        // the left most position (0) and our current to make sure it doesn't exceed the left boundary
        const newScrollPosition = isForward ? Math.min(container.scrollLeft + scrollAmount, maxScrollLeft) :
        Math.max(container.scrollLeft - scrollAmount, 0)
        container.scrollTo({
        	left: newScrollPosition,
        	behavior: "smooth"
        })
	}

	useEffect(() => {
        const container = scrollRef.current
        if (!container) return

        // whenever we scroll, update the scroll state 
        const onScroll = () => {
            // debounce with requestAnimationFrame
            requestAnimationFrame(checkScrollBounds);
        };

        container.addEventListener("scroll", onScroll)
        // when component is no longer in use, remove the scroll event listener
        return () => container.removeEventListener("scroll", onScroll)
	}, [])


	const onClickForward = () => {
		handleScroll(true)
	}

	const onClickBackward = () => {
		handleScroll(false)
	}

	return (
		<div className = "flex flex-col gap-y-4">
			<div className = "flex flex-row justify-between items-start">
				<div><p className="font-bold text-lg">{title}</p></div>
				<div className = "mr-5 flex flex-row gap-x-2">
					<CircleButton disabled={disabledButtons.left} onClick={() => onClickBackward()}><IconLeftArrow/></CircleButton>	
					<CircleButton disabled={disabledButtons.right} onClick={() => onClickForward()}><IconRightArrow/></CircleButton>
				</div>
			</div>
			<div ref={scrollRef} className = {`${title !== "Quick picks" ? "flex flex-row gap-x-2" : ""} max-w-[680px] overflow-x-auto`}>
				{
					title === "Quick picks" ? (
						<SuggestedContentGrid content={content}/>
					) : (
						content.map((sContent: SuggestedContent) => {
							return <SideScrollContent content={sContent}/>
						})
					)
				}				
			</div>
		</div>
	)
}
