import { BsFillFastForwardFill } from "react-icons/bs"
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconFastForward = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<BsFillFastForwardFill/>
		</BaseIcon>
	)
}
