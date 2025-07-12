import Loading from "../common/Loading"

const buttonVariants = {
  primary: { wrapper: "", button: "button-primary" },
  secondary: { wrapper: "", button: "button" },
  danger: { wrapper: "", button: "button bg-red-500 hover:bg-red-400 text-white" },
  warning: { wrapper: "", button: "button bg-yellow-600 hover:bg-yellow-700 text-white" },
  text: {
    wrapper: "inline",
    button: "cursor-pointer underline transition-smooth hover:opacity-70",
  },
  empty: { wrapper: "", button: "cursor-pointer transition-smooth hover:opacity-70" },
  none: { wrapper: "", button: "" },
}

const tooltipPositionMap = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
}

const Button = ({
  variant = "secondary",
  isPending,
  children,
  onClick,
  wrapperClassName = "",
  className = "",
  tooltip,
  disabledTooltip,
  tooltipPosition = "bottom",
  disabled,
  ...rest
}) => {
  const shouldShowTooltip = tooltip && (!disabled || disabledTooltip)
  const tooltipToShow = disabled ? disabledTooltip : tooltip

  const selectedButton = buttonVariants[variant]

  return (
    <div className={`relative group/button ${selectedButton.wrapper} ${wrapperClassName}`}>
      <button
        onClick={onClick}
        className={`relative ${selectedButton.button} ${className} ${
          isPending ? "text-transparent" : ""
        } ${disabled ? " cursor-not-allowed" : ""}`}
        disabled={disabled || isPending}
        {...rest}
      >
        {isPending ? (
          <Loading
            isCentered={false}
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
            color="border-gray-50"
            size="small"
          />
        ) : (
          ""
        )}
        {children}
      </button>
      {shouldShowTooltip ? (
        <div
          className={`absolute z-100 ${tooltipPositionMap[tooltipPosition]} select-none w-max px-2 py-1 text-xs text-white bg-gray-700 rounded invisible opacity-0 pointer-events-none group-hover/button:opacity-80 backdrop-blur-2xl group-hover/button:visible transition`}
        >
          {tooltipToShow}
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default Button
