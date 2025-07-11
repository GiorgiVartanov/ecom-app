const CarouselItem = ({
  title,
  image,
  onClick,
  className = "",
  imageLoading = "eager",
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      className={`p-3 hover:opacity-80 cursor-pointer bg-white flex-1 flex flex-col justify-between h-full w-full transition-opacity duration-200 ${className}`}
      {...rest}
    >
      <div className="flex-1 flex items-center justify-center">
        <img
          src={image}
          alt=""
          className="p-3"
          loading={imageLoading}
        />
      </div>
      <p>{title}</p>
    </button>
  )
}

export default CarouselItem
