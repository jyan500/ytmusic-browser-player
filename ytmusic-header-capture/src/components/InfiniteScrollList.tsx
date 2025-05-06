import React, { useState, useEffect } from "react"
import { ITEMS_PER_VIEW } from "../helpers/constants"
import { useInView } from "react-intersection-observer"
import { GenericPropType, WithAttribute } from "../types/common"

export const InfiniteScrollList = <T extends WithAttribute, P={}>({data, props, component: Component}: GenericPropType<T, P>) => {
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
			<Component data={visibleItems} {...(props as P)}/>
			{visibleCount < data.length && (
				<div ref={ref} id="sentinel" className="h-8"></div>
			)}
		</div>
	)
}
