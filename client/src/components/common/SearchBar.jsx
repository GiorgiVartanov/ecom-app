import { useState, useEffect } from "react"

import FilterIcon from "../../assets/icons/filter.svg?react"

import Button from "./Button"
import SearchFilterModal from "../products/SearchFilterModal"

// renders search bar with debounced search and filter modal
const SearchBar = ({ inputValue, setInputValue, searchParams, setSearchParams }) => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  const handleOpenFilterModal = () => {
    setIsFilterModalOpen(true)
  }

  const handleCloseFilterModal = () => {
    setIsFilterModalOpen(false)
  }

  const handleResetSearchParams = () => {
    const query = searchParams.get("query") || ""
    const page = searchParams.get("page") || "1"
    const limit = searchParams.get("limit") || "20"

    setSearchParams({ query: query, page: page, limit: limit })
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams(
        (params) => {
          params.set("query", inputValue)
          return params
        },
        { replace: true }
      )
    }, 300)

    return () => clearTimeout(handler)
  }, [inputValue, setSearchParams])

  const entries = Array.from(searchParams.entries())

  // checks if there are parameters other than query, page, and limit
  const showResetButton = entries.some(
    ([key]) => key !== "query" && key !== "page" && key !== "limit"
  )

  return (
    <div>
      <div className="mx-auto flex items-center gap-3 mb-7 max-w-full w-md relative">
        <input
          type="search"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products…"
          className="px-2 py-1.5 mx-auto w-full rounded outline-gray-100 outline-2 focus:outline-primary block transition-colors duration-200 ease-in-out"
        />
        <button
          onClick={handleOpenFilterModal}
          className="h-8 hover:opacity-70 transition-opacity duration-200 ease-in-out"
        >
          {<FilterIcon className="icon h-8" />}
        </button>
        <button
          className={`absolute -bottom-6.5 text-gray-400 transition-opacity hover:opacity-70 duration-200 ease-in-out ${
            !showResetButton ? "invisible" : ""
          }`}
          onClick={handleResetSearchParams}
        >
          reset filters
        </button>
      </div>
      <SearchFilterModal
        isOpen={isFilterModalOpen}
        onClose={handleCloseFilterModal}
      />
    </div>
  )
}

export default SearchBar
