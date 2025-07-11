const sizes = { small: "border-6 w-8 h-8", medium: "border-8 w-12 h-12" }

const Loading = ({
  color = "border-primary",
  size = "medium",
  isCentered = "true",
  className = "",
}) => {
  return (
    <div
      className={`appear-slow ${
        isCentered ? "absolute top-1/2 left-1/2 translate-x-1/2 translate-y-1/2" : ""
      } ${className}`}
    >
      <div
        className={`animate-spin rounded-full ${color} border-b-transparent ${sizes[size]}`}
      ></div>
    </div>
  )
}
export default Loading
