import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

type Props = {
	text: string
	className?: string
} & ButtonProps

export const PillButton = ({text, className, children, ...rest}: Props) => {
	return (
        <button className={`${className} flex flex-row gap-x-2 items-center bg-white text-black px-3 py-1 rounded-md`} {...rest}>{children}<p className = "font-semibold">{text}</p></button>
	)	
}
