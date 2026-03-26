// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay: number): T {
	// State to store our debounced value
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		// Set a timeout to update debounced value after the specified delay
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		// Clean up the timeout if value changes (e.g., user types again)
		// or if the component unmounts
		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]); // Only re-call effect if value or delay changes

	return debouncedValue;
}

export default useDebounce;
