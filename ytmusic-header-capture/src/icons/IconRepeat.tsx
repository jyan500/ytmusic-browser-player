import { BsRepeat } from "react-icons/bs"
import { BaseIcon } from "./BaseIcon"

interface Props {
    color?: string
    className?: string
}

export const IconRepeat = ({ color, className }: Props) => (
    <BaseIcon color={color} className={className}>
        <BsRepeat />
    </BaseIcon>
)