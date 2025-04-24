import { BsMusicNoteBeamed } from 'react-icons/bs';
import { BaseIcon } from "./BaseIcon"

interface Props {
	color?: string
	className?: string
}

export const IconMusicNote = ({color, className}: Props) => {
	return (
		<BaseIcon color={color} className={className}>
			<BsMusicNoteBeamed/>
		</BaseIcon>
	)
}
