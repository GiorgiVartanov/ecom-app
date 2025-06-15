import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"

import { getProduct } from "../../api/products.api"

import UploadProduct from "../../components/products/UploadProduct"

const createQuery = (id) => ({
  queryKey: ["product", "admin", id],
  queryFn: async () => getProduct(id),
})

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const query = createQuery(params.id)
    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
  }

const EditProductsDashboardPage = () => {
  const { id } = useParams()

  const { data, isLoading, error } = useQuery(createQuery(id))

  // console.log(data)

  if (isLoading) return <div>loading...</div>

  if (error) return <div>something went wrong</div>

  return (
    <div>
      <UploadProduct
        defaultData={data}
        isEditing={true}
        id={id}
      />
    </div>
  )
}

export default EditProductsDashboardPage
