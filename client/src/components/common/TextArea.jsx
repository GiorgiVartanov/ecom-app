const Textarea = (
  { label, className, itemClassName, error, disableSuggestions = true, ...rest },
  ref
) => (
  <div className={`flex flex-col ${className}`}>
    {label ? <label className="mb-1 text-sm font-medium text-gray-700">{label}</label> : ""}
    <textarea
      ref={ref}
      autoComplete={disableSuggestions ? "off" : rest.autoComplete}
      autoCorrect={disableSuggestions ? "off" : rest.autoCorrect}
      spellCheck={disableSuggestions ? false : rest.spellCheck}
      className={`border w-full rounded block px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition-colors resize-none ${
        error ? "border-red focus:ring-red" : "border-gray-300"
      } ${itemClassName}`}
      {...rest}
    />
    {error && <span className="mt-1 text-xs text-red">{error}</span>}
  </div>
)

export default Textarea
