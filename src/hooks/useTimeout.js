import { useEffect, useRef } from "react";
/**
 * Runs a timeout after delay ms.
 * 
 * @param callback function to execute
 * @param delay delay time in ms
 * 
 * Usage:
  
   useTimeout(
    () => console.log("executed"),
    300
  )
 */
export default function useTimeout(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current();
    }

    if (delay !== null) {
      const id = setTimeout(tick, delay);
      return () => clearTimeout(id);
    }
  }, [delay]);
}
