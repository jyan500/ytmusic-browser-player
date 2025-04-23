import { RiMenuAddLine } from 'react-icons/ri';
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconMenu = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<RiMenuAddLine/>
		</BaseIcon>
	)
}
