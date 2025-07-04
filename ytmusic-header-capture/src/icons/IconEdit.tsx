import { MdModeEdit } from "react-icons/md";
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconEdit = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<MdModeEdit/>
		</BaseIcon>
	)
}

