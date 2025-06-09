import { useState } from "react"
import { useLocation, useNavigate } from "react-router"

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const location = useLocation()
  const navigate = useNavigate()

  console.log(location)

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault()

    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <div
      key={location.pathname}
      className={`ml-auto mr-[2vw]  ${
        location.pathname === "/search"
          ? "absolute top-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-96 text-center fade-in-top"
          : ""
      }`}
    >
      <form
        onSubmit={handleSearch}
        className=""
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          className={`border-gray-100 border-2 rounded-sm block w-full px-2 py-0.5 focus:border-primary outline-none transition-colors duration-200 ${
            location.pathname === "/search" ? "text-center" : ""
          }`}
          placeholder={location.pathname === "/search" ? "Search" : "Search..."}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()

              handleSearch(e)
            }
          }}
        />
      </form>
    </div>
  )
}
export default SearchBar
