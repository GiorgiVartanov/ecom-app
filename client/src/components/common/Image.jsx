import { useState, useRef, useLayoutEffect } from "react"

import { useOnClickOutside } from "../../hooks/useOnClickOutside"

const Image = ({ src, alt, className, canFullscreen = true }) => {
  const [isFullScreenImageOpen, setIsFullScreenImageOpen] = useState(false)
  const ref = useRef(null)

  useOnClickOutside(ref, () => setIsFullScreenImageOpen(false))

  // blocks scrolling when image is in a full screen
  useLayoutEffect(() => {
    if (isFullScreenImageOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.classList.add("overflow-hidden")
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`
      }
    } else {
      document.body.classList.remove("overflow-hidden")
      document.body.style.paddingRight = ""
    }

    return () => {
      // cleanup in case component unmounts while open
      document.body.classList.remove("overflow-hidden")
      document.body.style.paddingRight = ""
    }
  }, [isFullScreenImageOpen])

  const renderFullScreenImage = () => {
    return (
      <div className="bg-foreground/45 h-screen w-screen fixed top-0 left-0 z-50 flex items-center justify-center appear">
        <div className="relative">
          <img
            ref={ref}
            src={src}
            alt={alt}
            className="max-w-[95vw] max-h-[95vh] md:max-w-[80vw] md:max-h-[80vh]"
          />
          <p className="text-gray-800 text-sm font-bold opacity-50 text-center absolute -bottom-6.5 left-0 w-full">
            click outside to close
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {canFullscreen && isFullScreenImageOpen ? renderFullScreenImage() : ""}
      <img
        src={src}
        alt={alt}
        className={className}
        onClick={canFullscreen ? () => setIsFullScreenImageOpen(true) : undefined}
        style={canFullscreen ? { cursor: "pointer" } : undefined}
      />
    </>
  )
}

export default Image
