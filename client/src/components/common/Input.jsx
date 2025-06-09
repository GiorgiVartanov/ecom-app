const Input = (
  { label, className, type = "text", error, disableSuggestions = true, ...rest },
  ref
) => (
  <div className={`flex flex-col ${className}`}>
    {label ? <label className="mb-1 text-sm font-medium text-gray-700">{label}</label> : ""}
    <input
      ref={ref}
      type={type}
      autoComplete={disableSuggestions ? "off" : rest.autoComplete}
      autoCorrect={disableSuggestions ? "off" : rest.autoCorrect}
      spellCheck={disableSuggestions ? false : rest.spellCheck}
      className={`border w-full rounded block px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
        error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
      }`}
      {...rest}
    />
    {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
  </div>
)

export default Input
