import React from "react"

interface Props {
	page: number
	setPage: (page: number) => void
	totalPages: number
}

export const PaginationRow = ({page, setPage, totalPages}: Props) => {
	return (
		<div className = "flex flex-row gap-x-2">
			<button disabled={page == 1} onClick={() => {
				setPage(page-1)
			}}>Prev</button>
			<button disabled={page == totalPages} onClick={() => {
				setPage(page+1)
			}}>Next</button>	
		</div>
	)
}
