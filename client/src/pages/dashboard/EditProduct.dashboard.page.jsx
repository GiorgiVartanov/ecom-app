import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"

import { getProduct } from "../../api/products.api"

import UploadProduct from "../../components/products/UploadProduct"
import Loading from "../../components/common/Loading"

const createQuery = (id) => ({
  queryKey: ["product", id],
  queryFn: async () => getProduct(id),
})

const EditProductsDashboardPage = () => {
  const { id } = useParams()

  const { data, isLoading, error } = useQuery(createQuery(id))

  if (isLoading) return <Loading />

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
