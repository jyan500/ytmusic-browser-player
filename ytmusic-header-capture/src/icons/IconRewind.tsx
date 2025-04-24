import { BsFillRewindFill } from "react-icons/bs"
import { BaseIcon } from "./BaseIcon"

interface Props {
    color?: string
    className?: string
}

export const IconRewind = ({ color, className }: Props) => (
    <BaseIcon color={color} className={className}>
        <BsFillRewindFill />
    </BaseIcon>
)
