import ReviewStarScoreSelect from "./ReviewStarSelect"

const ReviewItem = ({ review }) => {
  const calculateTime = (time) => {
    const now = new Date()
    const reviewDate = new Date(time)

    const diffInSeconds = Math.floor((now - reviewDate) / 1000)
    if (diffInSeconds < 60) return `just now`

    const diffInMinutes = Math.floor(diffInSeconds / 60)
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const wasEdited = review.updatedAt && new Date(review.updatedAt) > new Date(review.createdAt)

  return (
    <div className="py-4">
      <div className="flex items-center mb-2">
        <span className="font-semibold text-gray-700">{review.user.name}</span>
        <span className="ml-2 text-sm text-gray-500">{calculateTime(review.createdAt)}</span>
        <span className="text-sm text-gray-400 ml-2">{wasEdited ? `(edited)` : ""}</span>
      </div>
      <p
        className="text-gray-700"
        style={{ whiteSpace: "pre-line" }}
      >
        {review.text.replace(/(\n\s*){4,}/g, "\n\n\n")}
        {/* replaces 3 or more newlines with 2 newlines */}
      </p>
      <div className="mt-0.5">
        <ReviewStarScoreSelect
          value={review.score}
          starSize="small"
          isEditable={false}
        />
      </div>
    </div>
  )
}

export default ReviewItem
