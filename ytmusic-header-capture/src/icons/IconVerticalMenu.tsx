import { BsThreeDotsVertical } from "react-icons/bs";
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconVerticalMenu = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<BsThreeDotsVertical/>
		</BaseIcon>
	)
}
