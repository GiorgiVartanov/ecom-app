import Arrow from "../../assets/icons/arrow.svg?react"
import XMark from "../../assets/icons/xmark.svg?react"

import Button from "../common/Button"

const PreviewImage = ({ url, index, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) => {
  return (
    <div className="relative w-48 h-48 rounded mx-auto">
      <img
        src={url}
        alt={`preview ${index}`}
        className="w-full h-full p-2 object-contain rounded"
      />
      <div className="absolute h-full top-1 -right-12 flex flex-col space-y-1 justify-center">
        <Button
          type="button"
          onClick={() => onRemove(index)}
          className="px-2.5 bg-transparent shadow-none hover:opacity-70"
        >
          <XMark className="icon" />
        </Button>
        <Button
          type="button"
          onClick={() => onMoveUp(index)}
          disabled={isFirst}
          className="px-2.5 bg-transparent shadow-none hover:opacity-70"
        >
          <Arrow className="icon" />
        </Button>
        <Button
          type="button"
          onClick={() => onMoveDown(index)}
          disabled={isLast}
          className="px-2.5 bg-transparent shadow-none hover:opacity-70"
        >
          <Arrow className="icon rotate-180" />
        </Button>
      </div>
    </div>
  )
}

export default PreviewImage
