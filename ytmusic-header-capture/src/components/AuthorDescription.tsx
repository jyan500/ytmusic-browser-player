import React from "react"
import { goTo } from "react-chrome-extension-router"
import { User } from "../pages/User"
import { OptionType, ContainsAuthor } from "../types/common"

interface Props {
	content?: ContainsAuthor | undefined | null
}

export const AuthorDescription = ({content}: Props) => {
	const onClickAuthor = (authorId: string) => {
		goTo(User, {channelId: authorId})
		return
	}
	const length = content?.author?.length ?? 0
	return (
		<>
			{
				content?.author?.length ? 
					content?.author?.map((author: OptionType, index: number) => {
						return (
							<a key={author.id} className = {author.id ? `hover:opacity-60 hover:underline` : ""} onClick={
								(e) => {
									e.preventDefault()
									author.id ? onClickAuthor(author.id) : {}
								}}
							>{author.name} {index !== length - 1 ? "• " : ""}</a>
						)
					})
				: <></>
			}
		</>
	)
}
