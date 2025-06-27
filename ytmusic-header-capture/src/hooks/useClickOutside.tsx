import React, { RefObject, useEffect } from "react"

/*
Places a click event listener on the component that is designated by the ref
Removes the click handler when the component unmounts or if addEventListener is false
If user clicks anywhere outside of the ref that was passed in, trigger callback function
*/
export const useClickOutside = (
	ref: RefObject<HTMLElement | undefined | null>, 
	callback: () => void, 
	ignoreClickRef: RefObject<HTMLElement | undefined | null> | undefined | null,
	addEventListener = true
) => {
	const handleClick = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as HTMLElement) 
			&& (ignoreClickRef?.current && !ignoreClickRef.current.contains(event.target as HTMLElement))){
			callback()
		}
	}

	useEffect(() => {
		// note, this needed to be changed from "click" to "mousedown" to avoid issues where the 
		// event.target above refers to an original version of the DOM before potential changes were made to it,
		// therefore becoming stale. When using mousedown, it will fire immediately before any onClick handlers, 
		// so ref.current is still the same as before, and event.target is still inside it.
		// This fixed an issue inside the SearchResults where clicking the X mark
		// that should've been inside ref.current was getting treated as outside.
		if (addEventListener){
			document.addEventListener("mousedown", handleClick)
		}

		return () => {
			document.removeEventListener("mousedown", handleClick)
		}
	}, [addEventListener])
}
