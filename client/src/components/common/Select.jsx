const tooltipPositionMap = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
}

const Select = ({
  name,
  options,
  value,
  onChange,
  tooltip,
  tooltipPosition = "bottom",
  isControlled = false, // whether the select is controlled (has value and onChange) or uncontrolled (does not have value and onChange)
  disabled,
  disabledTooltip,
  showLabel = true,
  includeDefaultOption = true,
  className = "",
  wrapperClassName = "",
  ...rest
}) => {
  const shouldShowTooltip = tooltip && (!disabled || disabledTooltip)
  const tooltipToShow = disabled ? disabledTooltip : tooltip

  return (
    <div className={`flex flex-col gap-1 relative group/select ${wrapperClassName}`}>
      {showLabel ? (
        <label className="text-sm mb-1 ml-0.5 capitalize text-gray-700 font-semibold">{name}</label>
      ) : (
        ""
      )}
      <select
        id={name}
        name={name}
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : value}
        onChange={isControlled ? onChange : undefined}
        disabled={disabled}
        className={`border w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${className} ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        {...rest}
      >
        {includeDefaultOption ? <option value="">all</option> : ""}
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
      {shouldShowTooltip ? (
        <div
          className={`absolute z-100 ${tooltipPositionMap[tooltipPosition]} select-none w-max px-2 py-1 text-xs text-white bg-gray-700 rounded invisible opacity-0 pointer-events-none group-hover/select:opacity-80 backdrop-blur-2xl group-hover/select:visible transition`}
        >
          {tooltipToShow}
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default Select
