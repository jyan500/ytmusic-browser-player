import { BsSkipEndFill } from "react-icons/bs"
import { BaseIcon } from "./BaseIcon"

interface Props {
    color?: string
    className?: string
}

export const IconSkipEnd = ({ color, className }: Props) => (
    <BaseIcon color={color} className={className}>
        <BsSkipEndFill />
    </BaseIcon>
)