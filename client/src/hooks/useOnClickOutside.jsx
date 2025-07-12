import { useEffect } from "react"

// runs passed function when user clicks outside of passed ref and excludeRef
export const useOnClickOutside = (ref, handler, excludeRef = null) => {
  useEffect(() => {
    const listener = (e) => {
      // if excludeRef is provided, only run handler if click is inside excludeRef
      if (excludeRef && excludeRef.current && !excludeRef.current.contains(e.target)) {
        return
      }

      // never runs handler if click is inside the main ref
      if (!ref.current || ref.current.contains(e.target)) {
        return
      }

      handler(e)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler, excludeRef])
}
