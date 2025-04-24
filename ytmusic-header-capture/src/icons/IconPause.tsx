import { BsFillPauseFill } from "react-icons/bs"
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconPause = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<BsFillPauseFill/>
		</BaseIcon>
	)
}
