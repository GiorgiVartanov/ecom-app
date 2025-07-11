import { useState } from "react"
import EyeIcon from "../../assets/icons/eye.svg?react"
import EyeCloseIcon from "../../assets/icons/eye-close.svg?react"

const Input = ({
  label,
  className,
  itemClassName,
  type = "text",
  error,
  disableSuggestions = true,
  placeholder,
  ...rest
}) => {
  // tracks whether password is visible
  const [isVisible, setIsVisible] = useState(false)

  // toggles password visibility
  const toggleVisibility = () => {
    setIsVisible((prev) => !prev)
  }

  // determine placeholder
  const getPasswordDot = () => {
    const ua = navigator.userAgent
    if (ua.includes("Firefox")) {
      return "\u25CF" // large black circle
    }
    // Default to Chrome/Edge/Safari/others
    return "\u2022" // small bullet
  }

  const computedPlaceholder =
    type === "password"
      ? isVisible
        ? placeholder
        : getPasswordDot().repeat(placeholder ? placeholder.length : 8)
      : placeholder

  return (
    <div>
      <div className={`relative flex flex-col ${className}`}>
        {label ? (
          <label className="mb-1 ml-0.5 font-semibold text-sm text-gray-700">{label}</label>
        ) : (
          ""
        )}

        <input
          type={type === "password" && isVisible ? "text" : type}
          autoComplete={disableSuggestions ? "off" : rest.autoComplete}
          autoCorrect={disableSuggestions ? "off" : rest.autoCorrect}
          spellCheck={disableSuggestions ? false : rest.spellCheck}
          placeholder={computedPlaceholder}
          className={`border w-full rounded block pl-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-colors placeholder:opacity-40 ${
            type === "password" ? "pr-10" : ""
          } ${error ? "border-red focus:ring-red" : "border-gray-300"} ${itemClassName}`}
          {...rest}
        />

        {type === "password" ? (
          <button
            type="button"
            tabIndex={-1} // removes button from tab order
            onClick={toggleVisibility}
            className="absolute right-3 bottom-2.5 group "
          >
            {isVisible ? (
              <EyeCloseIcon className="icon group-hover:text-gray-300 text-gray-200 scale-110 transition-colors duration-200" />
            ) : (
              <EyeIcon className="icon group-hover:text-gray-300 text-gray-200 transition-colors duration-200" />
            )}
          </button>
        ) : (
          ""
        )}
      </div>
      {error ? <span className="mt-1 text-xs text-red">{error}</span> : ""}
    </div>
  )
}

export default Input
