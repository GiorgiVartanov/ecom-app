const TagList = ({ tags, className = "" }) => {
  if (!tags) return null

  return (
    <div className={`flex flex-col flex-wrap gap-2 justify-center ${className}`}>
      {tags.map(({ key, value }) => (
        <div
          key={key}
          className="flex justify-between w-full items-center px-3 py-3 text-sm even:bg-gray-100 rounded"
        >
          <span className="font-medium">{key}</span>
          <span className="text-gray-600">{value}</span>
        </div>
      ))}
    </div>
  )
}

export default TagList
