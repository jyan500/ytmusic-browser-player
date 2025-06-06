import { RiPlayListAddLine } from "react-icons/ri";
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconAddToPlaylist = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<RiPlayListAddLine/>
		</BaseIcon>
	)
}

