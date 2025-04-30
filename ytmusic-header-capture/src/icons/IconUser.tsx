import { BaseIcon } from "./BaseIcon"
import { CgProfile } from "react-icons/cg"

interface Props {
	color?: string
	className?: string
}

export const IconUser = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<CgProfile/>
		</BaseIcon>
	)
}
