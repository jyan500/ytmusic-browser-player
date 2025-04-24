import { BsSkipStartFill } from "react-icons/bs"
import { BaseIcon } from "./BaseIcon"

interface Props {
    color?: string
    className?: string
}

export const IconSkipStart = ({ color, className }: Props) => (
    <BaseIcon color={color} className={className}>
        <BsSkipStartFill />
    </BaseIcon>
)