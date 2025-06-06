import React, {ReactNode} from "react" 
import "../../assets/toast.css"
import { IconClose } from "../../icons/IconClose"
	
type Props = {
	id: string
	message: string
	onClose: () => void
	animationStyle: Record<string, any>
	animationHandler: (id: string) => void
}

export const Toast = ({id, message, onClose, animationStyle, animationHandler}: Props) => {
	return (
		<div id = {id} 
			onAnimationEnd={(e) => animationHandler(id)}
			style = {animationStyle} 
			className={`toast`} role="alert">
			<div className="flex flex-row items-center justify-center">
				<p className = "font-medium text-md">{message}</p>	
			</div>
			<button 
				className = "absolute top-0 right-0 mt-1 mr-1"
				onClick={onClose}
				>
				<IconClose/>
			</button>
		</div>
	)
}