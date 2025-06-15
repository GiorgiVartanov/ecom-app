const TagList = ({ tags }) => {
  if (!tags) return null

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(({ key, value }) => (
        <div
          key={key}
          className="flex items-center gap-1 shadow-sm bg-gray-100 rounded-full px-3 py-1 text-sm"
        >
          <span className="font-medium">{key} | </span>
          <span className="text-gray-600"> {value}</span>
        </div>
      ))}
    </div>
  )
}

export default TagList
