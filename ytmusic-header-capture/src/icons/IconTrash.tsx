import { IoTrash } from "react-icons/io5";
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconTrash = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<IoTrash/>
		</BaseIcon>
	)
}

