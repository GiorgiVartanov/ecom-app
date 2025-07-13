import { useParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

import { getUser } from "../api/user.api"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

import Loading from "../components/common/Loading"

const createQuery = (id) => ({
  queryKey: ["user", id],
  queryFn: async () => getUser(id),
})

const Profile = () => {
  const { id } = useParams()

  const { data: user, isLoading, error } = useQuery(createQuery(id))

  const [, setDocumentTitle] = useDocumentTitle("Profile")

  useEffect(() => {
    if (user?.name) {
      // after user is fetched from a backend - sets page's title to their username
      setDocumentTitle(`${user.name} - PcPal`)
    }
  }, [user?.name, setDocumentTitle])

  if (isLoading) return <Loading />

  if (error) return <div>something went wrong</div>

  return <div>{user?.name}</div>
}
export default Profile
