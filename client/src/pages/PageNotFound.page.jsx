import { useNavigate } from "react-router"

import Button from "../components/common/Button"

const PageNotFound = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="grid place-content-center h-[calc(100vh-8rem)]">
      <h3 className="text-3xl">404 Page Not Found</h3>
      <Button
        onClick={handleGoBack}
        className="text-2xl font-semibold mt-2 link hover:text-primary"
      >
        go back
      </Button>
    </div>
  )
}

export default PageNotFound
