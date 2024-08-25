import { useState, useEffect } from 'react';

export function useScreenWidth() {
    // State to store the current window width
    if (typeof window !== "undefined") {
        const [width, setWidth] = useState(window.innerWidth);

        useEffect(() => {
            // Handler to call on window resize
            function handleResize() {
                setWidth(window.innerWidth);
            }

            // Add event listener
            window.addEventListener('resize', handleResize);

            // Call handler right away so state gets updated with initial window size
            handleResize();

            // Remove event listener on cleanup
            return () => window.removeEventListener('resize', handleResize);
        }, []); // Empty array ensures that effect is only run on mount and unmount

        return width;
    } else {
        // Return a default width when running in environments without a window object
        return 1024; // Default width, can be adjusted according to typical use cases
    }
}
