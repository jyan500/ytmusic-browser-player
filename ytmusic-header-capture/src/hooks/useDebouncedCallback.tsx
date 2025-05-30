import { useRef, useCallback } from 'react';

/* within a certain delay, the debouncing will allow the callback to only run one time. This helps to avoid
conflicts in pause/play when the user clicks repeatedly on the progress bar for example  */
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
