import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Determines whether the current viewport width is considered mobile and keeps the value updated on viewport changes.
 *
 * The hook initializes its value on mount and updates automatically when the viewport width crosses the mobile threshold.
 *
 * @returns `true` if the viewport width is less than MOBILE_BREAKPOINT, `false` otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(globalThis.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}