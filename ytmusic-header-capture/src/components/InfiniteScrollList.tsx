import React, { useState, useEffect } from "react"
import { ITEMS_PER_VIEW } from "../helpers/constants"
import { useInView } from "react-intersection-observer"
import { WithTitle, FlatList } from "./FlatList"

type ComponentWithDataProp<T extends WithTitle, P = {}> = React.FC<{ data: T[] } & P>

type Props<T extends WithTitle> = {
	data: Array<T>	
	component: ComponentWithDataProp<T>
}

export const InfiniteScrollList = <T extends WithTitle>({data, component: Component}: Props<T>) => {
	const [visibleCount, setVisibleCount] = useState(ITEMS_PER_VIEW)
	const {ref, inView} = useInView()

	useEffect(() => {
		if (inView && visibleCount < data.length){
			setVisibleCount((prev) => prev + ITEMS_PER_VIEW)
		}
	}, [inView])

	const visibleItems = data.slice(0, visibleCount)

	return (
		<div>
			<Component data={visibleItems}/>
			{visibleCount < data.length && (
				<div ref={ref} id="sentinel" className="h-8"></div>
			)}
		</div>
	)
}