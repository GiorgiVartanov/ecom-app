import Arrow from "../../assets/icons/arrow.svg?react"
import XMark from "../../assets/icons/xmark.svg?react"

import Button from "../common/Button"

const PreviewImage = ({ preview, idx, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) => {
  return (
    <div className="relative w-48 h-48 rounded mx-auto">
      <img
        src={preview}
        alt={`preview ${idx}`}
        className="w-full h-full object-cover rounded"
      />
      <div className="absolute top-1 -right-6 flex flex-col space-y-1">
        <Button
          type="button"
          onClick={() => onRemove(idx)}
          className="px-2.5 bg-transparent shadow-none hover:opacity-70"
        >
          <XMark className="icon" />
        </Button>
        <Button
          type="button"
          onClick={() => onMoveUp(idx)}
          disabled={isFirst}
          className="px-2.5 bg-transparent shadow-none hover:opacity-70"
        >
          <Arrow className="icon" />
        </Button>
        <Button
          type="button"
          onClick={() => onMoveDown(idx)}
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
