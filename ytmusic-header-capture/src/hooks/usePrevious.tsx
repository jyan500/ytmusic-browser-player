import { useRef, useEffect } from 'react'

export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>(undefined)

    useEffect(() => {
        ref.current = value
    }, [value])

    return ref.current
}
