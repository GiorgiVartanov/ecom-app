import { useState } from "react"
import { useSearchParams } from "react-router"
import { useQuery, useQueryClient } from "@tanstack/react-query"

import { getProducts } from "../api/products.api"
import useAuthStore from "../store/useAuthStore"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

import ProductGrid from "../components/products/ProductGrid"
import SearchBar from "../components/common/SearchBar"
import Loading from "../components/common/Loading"
import PageSelector from "../components/common/PageSelector"

export const createQuery = (filters, token) => ({
  queryFn: () => getProducts(filters, token),
  queryKey: [
    "search",
    token ? "logged-in" : "not-logged-in",
    Object.entries(filters)
      .map(([key, value]) => `${key}-${value}`)
      .join("_"),
  ],
})

const Search = () => {
  useDocumentTitle("Search - PcPal", "Search for products on PcPal")

  const token = useAuthStore((state) => state.token)
  const queryClient = useQueryClient()

  // const [limit, setLimit] = useState(20)

  const [searchParams, setSearchParams] = useSearchParams()

  const [inputValue, setInputValue] = useState(searchParams.get("query") || "")

  const filters = {
    ...Object.fromEntries(searchParams.entries()),
    query: searchParams.get("query") || "",
    page: searchParams.get("page") || 1,
    limit: searchParams.get("limit") || 20,
  }

  const { data, isLoading, error } = useQuery(createQuery(filters, token))

  const prefetchPage = (page) => {
    const newFilters = { ...filters, page: page.toString(), query: "" }

    queryClient.prefetchQuery(createQuery(newFilters, token))
  }

  const resetFilters = () => {
    setInputValue("")

    setSearchParams({}, { replace: true })
  }

  const goToPage = (page) => {
    // setCurrentPage(page)
    setSearchParams({ page: page.toString(), query: "" }, { replace: true })
  }

  const handleSetLimit = (limit) => {
    setSearchParams({ limit: limit.toString(), query: "" }, { replace: true })
  }

  const renderSearchBar = () => {
    return (
      <SearchBar
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        inputValue={inputValue}
        setInputValue={setInputValue}
      />
    )
  }

  const renderProductGrid = () => {
    if (isLoading) return <Loading />

    if (error) return <div>something went wrong</div>

    return (
      <ProductGrid
        resetFilters={resetFilters}
        data={data?.products}
        className="flex-1 mt-6"
      />
    )
  }

  const renderPageSelector = () => {
    const totalPages = data?.totalPages

    return (
      <PageSelector
        currentPage={searchParams.get("page") || 1}
        totalPages={totalPages}
        maximumPages={10}
        prefetchPage={prefetchPage}
        goToPage={goToPage}
        className="mt-12"
        limit={searchParams.get("limit") || 20}
        onLimitChange={handleSetLimit}
      />
    )
  }

  return (
    <div className="mt-6 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      {renderSearchBar()}
      {renderProductGrid()}
      {renderPageSelector()}
    </div>
  )
}

export default Search
