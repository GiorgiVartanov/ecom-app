import { useState, useEffect } from "react"

import FullStar from "../../assets/icons/full-star.svg?react"
import HalfStar from "../../assets/icons/half-star.svg?react"
import EmptyStar from "../../assets/icons/empty-star.svg?react"

const starSizeList = {
  small: "w-4 h-4",
  medium: "w-6 h-6",
  large: "w-8 h-8",
}

const ReviewStarScoreSelect = ({
  totalStars = 5,
  value = 0,
  onChange,
  starSize = "medium",
  isEditable = true,
}) => {
  const [score, setScore] = useState(value)

  useEffect(() => {
    setScore(value)
  }, [value])

  const getStarType = (index) => {
    const value = index + 1
    if (score >= value) return "full"
    if (score >= value - 0.5) return "half"
    return "empty"
  }

  const handleSliderChange = (event) => {
    if (!isEditable) return

    // calculates new score from slider and sends it with onChange function
    const newScore = parseFloat(event.target.value)
    setScore(newScore)
    onChange?.(newScore)
  }

  return (
    <div>
      <div className={`relative inline-flex gap-1`}>
        {Array.from({ length: totalStars }).map((star, index) => {
          const type = getStarType(index)

          return (
            <div
              key={index}
              className={`${starSizeList[starSize]}`}
            >
              {type === "full" ? (
                <FullStar className={`${starSizeList[starSize]} text-yellow-500`} />
              ) : type === "half" ? (
                <HalfStar className={`${starSizeList[starSize]} text-yellow-500`} />
              ) : (
                <EmptyStar className={`${starSizeList[starSize]} text-yellow-500`} />
              )}
            </div>
          )
        })}
        <input
          type="range"
          min={0}
          max={totalStars}
          step={0.5}
          value={score}
          onChange={handleSliderChange}
          className={`absolute inset-0 w-full h-full opacity-0 ${
            isEditable ? "cursor-pointer" : "cursor-default"
          }`}
        />
      </div>
    </div>
  )
}

export default ReviewStarScoreSelect
