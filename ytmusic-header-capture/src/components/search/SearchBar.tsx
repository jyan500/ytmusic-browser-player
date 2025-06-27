import React from "react"
import { IconSearch } from "../../icons/IconSearch"
import { IconClose } from "../../icons/IconClose"

interface Props {
	placeholder?: string
	searchTerm: string
	onChange: (param: string) => void
	onFocus: () => void
	onClear: () => void
}

export const SearchBar = React.forwardRef<HTMLDivElement, Props>(({placeholder, onChange, onFocus, searchTerm, onClear}: Props, ref) => {
	return (
		<div className = "w-full relative" ref={ref}>
			<IconSearch className="w-4 h-4 absolute top-2 left-2"/>	
			<input onFocus={onFocus} value={searchTerm} onChange={(e) => {
				onChange(e.target.value)
			}} name="autocomplete" placeholder={placeholder} className="focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md w-full h-8 bg-dark pl-10 pr-10" type="text"/>
			{
				searchTerm !== "" ? 
				<a onClick={(e) => {
					e.preventDefault() 
					console.log("clearing...")
					onClear()}
				} className = "w-4 h-4 absolute top-2 right-2"><IconClose/></a>
				: null
			}
		</div>
	)
})