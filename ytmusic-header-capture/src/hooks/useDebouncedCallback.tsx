import { useRef, useCallback } from 'react';

export const useDebouncedCallback = (callback: () => void, delay: number) => {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    return useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        timeoutRef.current = setTimeout(() => {
            callback()
        }, delay)
    }, [callback, delay])
}