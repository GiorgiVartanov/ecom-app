const Select = ({ name, values, defaultValue }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm mb-1 ml-0.5 capitalize text-gray-700 font-semibold">{name}</label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="border w-full border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">all</option>
        {values.map((value) => (
          <option
            key={value}
            value={value}
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Select
