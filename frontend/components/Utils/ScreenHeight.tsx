import { useState, useEffect } from 'react';

export function useScreenHeight() {
    // State to store the current window height
    if (typeof window !== "undefined") {
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            setHeight(window.innerHeight);
        }
            
        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount and unmount

    return height;
}else{
    return 700;
}
}
