import { BsShuffle } from "react-icons/bs"
import { BaseIcon } from "./BaseIcon"

interface Props {
    color?: string
    className?: string
}

export const IconShuffle = ({ color, className }: Props) => (
    <BaseIcon color={color} className={className}>
        <BsShuffle />
    </BaseIcon>
)
