import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router"

const SearchBar = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const params = new URLSearchParams(location.search)
  const initialQuery = params.get("query") || ""
  const [searchTerm, setSearchTerm] = useState(initialQuery)

  // updating the URL with debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentParams = new URLSearchParams(location.search)

      if (searchTerm.trim()) {
        currentParams.set("query", searchTerm.trim())
      } else {
        currentParams.delete("query")
      }

      navigate(`${location.pathname}?${currentParams.toString()}`, { replace: true })
    }, 1000)

    return () => clearTimeout(timeout)
  }, [searchTerm, navigate, location.pathname, location.search])

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const currentParams = new URLSearchParams(location.search)

      if (searchTerm.trim()) {
        currentParams.set("query", searchTerm.trim())
      } else {
        currentParams.delete("query")
      }

      navigate(`search/?${currentParams.toString()}`, { replace: true })
    }
  }

  // render search bar in header (compact, inline)
  const renderInHeader = () => (
    <div className="ml-auto mr-[2vw]">
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          onKeyDown={handleKeyPress}
          placeholder="Search..."
          className="border-2 border-gray-100 rounded-sm block w-full px-2 py-0.5 focus:border-primary outline-none transition-colors duration-200"
        />
      </form>
    </div>
  )

  // render search bar on dedicated page (centered, larger)
  const renderOnPage = () => (
    <div className="ml-auto mr-[2vw] absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-96 text-center fade-in-top">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          onKeyDown={handleKeyPress}
          placeholder="Search..."
          className="border-2 border-gray-100 rounded-sm block w-full px-2 py-0.5 text-center focus:border-primary outline-none transition-colors duration-200"
        />
      </form>
    </div>
  )

  return location.pathname === "/search" || location.pathname === "/dashboard/products"
    ? renderOnPage()
    : renderInHeader()
}

export default SearchBar
