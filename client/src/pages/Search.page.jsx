import { useSearchParams } from "react-router"
import { useQuery } from "@tanstack/react-query"

import { getProducts } from "../api/products.api"

import ProductGrid from "../components/products/ProductGrid"

const createQuery = (filters) => ({
  queryFn: () => getProducts(filters),
  queryKey: [
    "search",
    Object.entries(filters)
      .map(([key, value]) => `${key}-${value}`)
      .join("_"),
  ],
})

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const query = createQuery(params)
    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
  }

const Search = () => {
  const [searchParams] = useSearchParams()
  const filters = Object.fromEntries(searchParams.entries())

  const { data, isLoading, error } = useQuery(createQuery(filters))

  if (isLoading) return <div>Loading...</div>

  if (error) return <div>error</div>

  return (
    <div className="mt-20">
      <ProductGrid data={data} />
    </div>
  )
}

export default Search
