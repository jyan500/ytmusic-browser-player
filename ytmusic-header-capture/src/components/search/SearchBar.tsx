import React from "react"
import { IconSearch } from "../../icons/IconSearch"

interface Props {
	placeholder?: string
	onChange: (param: string) => void
}

export const SearchBar = ({placeholder, onChange}: Props) => {
	return (
		<div className = "w-full relative">
			<IconSearch className="w-4 h-4 absolute top-2 left-2"/>	
			<input onChange={(e) => {
				onChange(e.target.value)
			}} name="autocomplete" placeholder={placeholder} className="focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md w-full h-8 bg-dark pl-10" type="text"/>
		</div>
	)
}