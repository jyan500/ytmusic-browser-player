import { FaPlay } from "react-icons/fa";
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconPlay = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<FaPlay/>
		</BaseIcon>
	)
}
