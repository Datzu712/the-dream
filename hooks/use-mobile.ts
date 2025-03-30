import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * React hook that detects whether the current viewport is mobile-sized.
 *
 * This hook uses the `window.matchMedia` API to detect when the viewport width
 * is below the `MOBILE_BREAKPOINT` value. It sets up an event listener to
 * track changes in viewport size and updates the state accordingly.
 *
 * @returns {boolean} Returns `true` if the viewport width is less than the mobile breakpoint,
 *                    `false` otherwise.
 *
 * @example
 * function MyComponent() {
 *   const isMobile = useIsMobile();
 *
 *   return (
 *     <div>
 *       {isMobile ? 'Mobile View' : 'Desktop View'}
 *     </div>
 *   );
 * }
 */
export function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
        undefined,
    );

    React.useEffect(() => {
        const mql = window.matchMedia(
            `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
        );
        const onChange = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        mql.addEventListener('change', onChange);
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        return () => mql.removeEventListener('change', onChange);
    }, []);

    return !!isMobile;
}
