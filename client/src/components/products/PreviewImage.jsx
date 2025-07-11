import Arrow from "../../assets/icons/arrow.svg?react"
import XMark from "../../assets/icons/xmark.svg?react"

import Button from "../common/Button"

// renders a preview image for a product, is used on the upload product page
const PreviewImage = ({
  url,
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  className = "",
}) => {
  return (
    <div className={`relative w-48 h-48 rounded mx-auto md:mx-0 ${className}`}>
      <img
        src={url}
        alt={`preview ${index}`}
        className="w-full h-full p-2 object-contain rounded"
      />
      <div className="absolute h-full md:h-fit top-1 md:top-auto md:-bottom-0.5 right-6 md:right-1/2 translate-x-1/2 flex flex-col md:flex-row gap-1 justify-center">
        <Button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          className="px-2.5 h-fit bg-transparent shadow-none hover:opacity-70"
        >
          <Arrow className="icon md:rotate-270" />
        </Button>
        <Button
          type="button"
          onClick={() => onRemove(index)}
          className="px-2.5 h-fit bg-transparent shadow-none hover:opacity-70"
        >
          <XMark className="icon" />
        </Button>
        <Button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          className="px-2.5 h-fit bg-transparent shadow-none hover:opacity-70"
        >
          <Arrow className="icon rotate-180 md:rotate-90" />
        </Button>
      </div>
    </div>
  )
}

export default PreviewImage
