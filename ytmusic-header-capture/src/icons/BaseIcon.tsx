import { IconContext } from "react-icons"

interface Props {
	color?: string
	className?: string
	children: React.ReactNode
}

export const BaseIcon = ({color, className, children}: Props): React.ReactNode => {
	return (
		<IconContext.Provider value={{color: color ?? "", className: className ?? "w-4 h-4"}}>
			{children}
		</IconContext.Provider>
	)
}
