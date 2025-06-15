import { useState, useEffect } from "react"

import ArrowIcon from "../../assets/icons/arrow.svg?react"

const ProductImageSelect = ({
  images,
  handleSelectImage,
  currentIndex,
  maxSimultaneousImages = 5,
  className,
}) => {
  const [slideIndex, setSlideIndex] = useState(0)

  const handleNextButtonClick = () => {
    setSlideIndex((prev) =>
      prev + 1 >= images.length ? 0 : Math.min(prev + 1, images.length - maxSimultaneousImages)
    )
  }

  const handlePrevButtonClick = () => {
    setSlideIndex((prev) =>
      prev <= 0 ? Math.ceil(images.length / maxSimultaneousImages) - 1 : Math.max(prev - 1, 0)
    )
  }

  useEffect(() => {
    const isVisible =
      currentIndex >= slideIndex && currentIndex < slideIndex + maxSimultaneousImages

    if (!isVisible) {
      const newIndex = Math.max(
        0,
        Math.min(images.length - maxSimultaneousImages, currentIndex - (maxSimultaneousImages - 1))
      )
      setSlideIndex(newIndex)
    }
  }, [currentIndex, images.length, maxSimultaneousImages])

  if (!images) return null

  const renderImages = () => {
    return images.slice(slideIndex, slideIndex + maxSimultaneousImages).map((image, index) => (
      <button
        key={index}
        onClick={() => handleSelectImage(index + slideIndex)}
        className={`rounded-sm overflow-hidden border-2 p-1 shadow bg-gray-50 ${
          index + slideIndex === currentIndex ? "border-primary" : "border-transparent"
        }`}
      >
        {image ? (
          <img
            src={image}
            alt=""
            className="h-16 w-16 object-contain rounded-sm"
          />
        ) : (
          <div className="flex items-center justify-center h-16 w-16 text-gray-400">
            image not found
          </div>
        )}
      </button>
    ))
  }

  const renderPrevButton = () => {
    return (
      <button
        onClick={handlePrevButtonClick}
        disabled={slideIndex === 0}
        className="flex items-center p-1.5 relative disabled:text-gray-400"
      >
        <ArrowIcon className="h-5 w-5 rotate-270 disabled:opacity-70" />
        {slideIndex > 0 && <span className="text-sm absolute -bottom-3">+{slideIndex}</span>}
      </button>
    )
  }

  const renderNextButton = () => {
    return (
      <button
        onClick={handleNextButtonClick}
        disabled={slideIndex + maxSimultaneousImages >= images.length}
        className="flex items-center p-1.5 relative disabled:text-gray-400"
      >
        {images.length - (slideIndex + maxSimultaneousImages) > 0 && (
          <span className="text-sm absolute -bottom-3">
            +{images.length - (slideIndex + maxSimultaneousImages)}
          </span>
        )}
        <ArrowIcon className="h-5 w-5 rotate-90" />
      </button>
    )
  }

  const renderForFullAmountOfImages = () => {
    return (
      <div className={`flex items-center gap-1 justify-between ${className}`}>
        {renderPrevButton()}
        {renderImages()}
        {renderNextButton()}
      </div>
    )
  }

  const renderForSmallAmountOfImages = () => {
    return <div className={`flex items-center gap-1 ${className}`}>{renderImages()}</div>
  }

  return (
    <>
      {images?.length > maxSimultaneousImages
        ? renderForFullAmountOfImages()
        : renderForSmallAmountOfImages()}
    </>
  )
}

export default ProductImageSelect
