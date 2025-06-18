import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"

import { getUser } from "../api/user.api"

const createQuery = (id) => ({
  queryKey: ["user", id],
  queryFn: async () => getUser(id),
})

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const query = createQuery(params.id)
    return queryClient.getQueryData(query.queryKey) ?? (await queryClient.fetchQuery(query))
  }

const Profile = () => {
  const { id } = useParams()

  const { data: user, isLoading, error } = useQuery(createQuery(id))

  if (isLoading) return <div>loading...</div>

  if (error) return <div>something went wrong</div>

  return <div>{user?.name}</div>
}
export default Profile
