import { useState, useEffect, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"

import { getSearchTags } from "../../api/products.api"

import Modal from "../common/Modal"
import Button from "../common/Button"
import Select from "../common/Select"
import Input from "../common/Input"

const ORDER_BY_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price:asc" },
  { label: "Price: High to Low", value: "price:desc" },
  { label: "Newest", value: "createdAt:desc" },
  { label: "Oldest", value: "createdAt:asc" },
]

// renders modal with a search bar and a list of tags
const SearchFilterModal = ({ title, isOpen, onClose, className }) => {
  const [tagSearchString, setTagSearchString] = useState("")

  const [searchParams, setSearchParams] = useSearchParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ["tags"],
    queryFn: getSearchTags,
  })

  const renderTagSelectList = () => {
    if (isLoading) return

    if (error) return

    const { tags, priceRange } = data

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
      <TagSelectList
        tags={filteredTags}
        selectedTags={filters}
        priceRange={priceRange}
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
        {renderTagSelectList()}
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

const TagSelectList = ({ tags, selectedTags, priceRange }) => {
  const [showTopShadow, setShowTopShadow] = useState(false)
  const [showBottomShadow, setShowBottomShadow] = useState(false)
  const [isScrollable, setIsScrollable] = useState(false)

  const [currentMinPrice, setCurrentMinPrice] = useState(priceRange.min.toString())
  const [currentMaxPrice, setCurrentMaxPrice] = useState(priceRange.max.toString())

  const scrollRef = useRef(null)

  const minPrice = priceRange.min
  const maxPrice = priceRange.max

  // sets up scroll shadow effect for tag list
  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    // updates shadow visibility based on the scroll position
    const updateShadows = () => {
      const { scrollTop, scrollHeight, clientHeight } = element

      // determines if content is scrollable
      const scrollable = scrollHeight > clientHeight

      setIsScrollable(scrollable)
      // shows top shadow if not at the very top
      setShowTopShadow(scrollTop > 0)
      // shows bottom shadow if not at the very bottom
      setShowBottomShadow(scrollTop + clientHeight < scrollHeight)
    }

    // adds scroll event listener to update shadows on scroll
    element.addEventListener("scroll", updateShadows)
    // initializes shadow state on mount or tag change
    updateShadows()

    // cleans up event listener on unmount or tag change
    return () => {
      element.removeEventListener("scroll", updateShadows)
    }
  }, [tags])

  const handleMinPriceSave = (newMinPrice) => {
    if (isNaN(newMinPrice)) {
      return
    }

    // ensures min price doesn't exceed max price
    if (newMinPrice > currentMaxPrice) {
      setCurrentMinPrice(currentMaxPrice)
    }
    // ensures min price doesn't go below the minimum allowed price
    else if (newMinPrice < minPrice) {
      setCurrentMinPrice(minPrice)
    }
    // ensures min price doesn't exceed the maximum allowed price
    else if (newMinPrice > maxPrice) {
      setCurrentMinPrice(maxPrice)
    }
    // sets the new min price if it's within valid range
    else {
      setCurrentMinPrice(newMinPrice)
    }
  }

  const handleMinPriceChange = (e) => {
    setCurrentMinPrice(e.target.value)
  }

  const handleMinPriceBlur = (e) => {
    handleMinPriceSave(parseInt(e.target.value))
  }

  const handleMinPriceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleMinPriceSave(parseInt(e.target.value))
      e.target.blur()
    }
  }

  const handleMaxPriceSave = (newMaxPrice) => {
    if (isNaN(newMaxPrice)) {
      return
    }

    // ensures max price doesn't go below min price
    if (newMaxPrice < currentMinPrice) {
      setCurrentMaxPrice(currentMinPrice)
    }
    // ensures max price doesn't go below the minimum allowed price
    else if (newMaxPrice < minPrice) {
      setCurrentMaxPrice(minPrice)
    }
    // ensures max price doesn't exceed the maximum allowed price
    else if (newMaxPrice > maxPrice) {
      setCurrentMaxPrice(maxPrice)
    }
    // sets the new max price if it's within valid range
    else {
      setCurrentMaxPrice(newMaxPrice)
    }
  }

  const handleMaxPriceChange = (e) => {
    setCurrentMaxPrice(e.target.value)
  }

  const handleMaxPriceBlur = (e) => {
    handleMaxPriceSave(parseInt(e.target.value))
  }

  const handleMaxPriceKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleMaxPriceSave(parseInt(e.target.value))
      e.target.blur()
    }
  }

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
        <div className="flex flex-col gap-0.5 mb-1 mt-2">
          <span className="text-sm font-bold">Price:</span>
          <div className="flex gap-2 border-b-1 border-gray-300 pb-6">
            <Input
              type="text"
              label="from"
              name="priceFrom"
              placeholder={`Min: ${priceRange.min}`}
              value={currentMinPrice}
              onChange={handleMinPriceChange}
              onBlur={handleMinPriceBlur}
              onKeyDown={handleMinPriceKeyDown}
            />
            <Input
              type="text"
              label="to"
              name="priceTo"
              placeholder={`Max: ${priceRange.max}`}
              value={currentMaxPrice}
              onChange={handleMaxPriceChange}
              onBlur={handleMaxPriceBlur}
              onKeyDown={handleMaxPriceKeyDown}
            />
          </div>
        </div>
        <Select
          name="orderBy"
          options={ORDER_BY_OPTIONS.map((option) => option.value)}
          optionLabels={ORDER_BY_OPTIONS.map((option) => option.label)}
          isControlled={false}
          value={selectedTags?.orderBy || ""}
          includeDefaultOption={false}
          wrapperClassName="border-b-1 border-gray-300 pb-6"
        />
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
