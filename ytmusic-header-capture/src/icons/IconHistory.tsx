import { GoHistory } from "react-icons/go"
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconHistory = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<GoHistory/>
		</BaseIcon>
	)
}

