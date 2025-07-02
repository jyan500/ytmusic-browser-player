import { FaPlus } from "react-icons/fa6";
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconAdd = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<FaPlus/>
		</BaseIcon>
	)
}

