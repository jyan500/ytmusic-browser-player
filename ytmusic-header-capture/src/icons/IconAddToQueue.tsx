import { BsMusicNoteList } from "react-icons/bs";
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconAddToQueue = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<BsMusicNoteList/>
		</BaseIcon>
	)
}

