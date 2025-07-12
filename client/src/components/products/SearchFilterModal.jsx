import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"

import { getSearchTags } from "../../api/products.api"

import Modal from "../common/Modal"
import Button from "../common/Button"
import Select from "../common/Select"

// renders a modal with a search bar and a list of tags
const SearchFilterModal = ({ title, isOpen, onClose, className }) => {
  const [tagSearchString, setTagSearchString] = useState("")

  const [searchParams, setSearchParams] = useSearchParams()

  const {
    data: tags,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getSearchTags,
  })

  const renderTagList = () => {
    if (isLoading) return

    if (error) return

    const filteredTags = [
      ...tags.filter((tag) => tag.key.toLowerCase().includes(tagSearchString.toLowerCase())),

      // matches where any value includes search term, but key doesn't match
      ...tags.filter(
        (tag) =>
          !tag.key.toLowerCase().includes(tagSearchString.toLowerCase()) &&
          tag.values.some((value) => value.toLowerCase().includes(tagSearchString.toLowerCase()))
      ),
    ]

    const filters = Object.fromEntries(searchParams.entries())

    return (
      <TagList
        tags={filteredTags}
        selectedTags={filters}
      />
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formElements = Array.from(e.target.elements)

    const formData = Object.fromEntries(
      formElements
        .filter(
          (element) =>
            element.name &&
            element.type !== "submit" &&
            element.type !== "button" &&
            element.value !== ""
        )
        .map((element) => [element.name, element.value])
    )

    const query = searchParams.get("query") || ""

    setSearchParams({
      query,
      ...formData,
    })

    onClose() // closes modal
  }

  return (
    <Modal
      title={title || "Search Filter"}
      isOpen={isOpen}
      onClose={onClose}
      className={`p-3 ${className}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="px-1">
          <input
            type="text"
            placeholder="Search tags..."
            className="border w-full border-gray-300 rounded-md px-3 py-2 mt-4 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => {
              setTagSearchString(e.target.value)
            }}
          />
        </div>
        {renderTagList()}
        <Button
          variant="primary"
          className="w-full mt-4"
        >
          Search
        </Button>
      </form>
    </Modal>
  )
}

export default SearchFilterModal

const TagList = ({ tags, selectedTags }) => {
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)

  const scrollRef = useRef(null)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    const updateShadows = () => {
      const { scrollTop, scrollHeight, clientHeight } = element

      const scrollable = scrollHeight > clientHeight

      setIsScrollable(scrollable)
      setShowTopShadow(scrollTop > 0)
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight)
    }

    element.addEventListener("scroll", updateShadows)
    updateShadows()

    return () => {
      element.removeEventListener("scroll", updateShadows)
    }
  }, [tags])

  return (
    <div className="relative">
      <div
        className={`
        absolute top-0 left-0 right-0 h-4
        bg-gradient-to-b from-black/7.5
        pointer-events-none z-10
        transition-opacity duration-200 ease-in-out
        ${showTopShadow ? "opacity-100" : "opacity-0"}
      `}
      />
      <div
        className={`
        absolute bottom-0 left-0 right-0 h-4
        bg-gradient-to-t from-black/7.5
        pointer-events-none z-10
        transition-opacity duration-200 ease-in-out
        ${showBottomShadow ? "opacity-100" : "opacity-0"}
      `}
      />
      <div
        ref={scrollRef}
        className={`overflow-y-auto max-h-[360px] flex flex-col gap-4 p-1 ${
          isScrollable ? "pr-4" : ""
        }`}
      >
        {tags.map((tag) => (
          <Select
            key={tag.key}
            name={tag.key}
            options={tag.values}
            isControlled={false}
            value={selectedTags?.[tag.key] || ""}
          />
        ))}
      </div>
    </div>
  )
}
