import { useNavigate } from "react-router"

import Button from "../components/common/Button"
import { useDocumentTitle } from "../hooks/useDocumentTitle"

const PageNotFound = () => {
  useDocumentTitle("404 Page Not Found - PcPal")

  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="grid place-content-center min-h-[calc(100vh-8rem)]">
      <h3 className="text-3xl">404 Page Not Found</h3>
      <Button
        onClick={handleGoBack}
        variant="none"
        className="text-2xl font-semibold mt-2 link w-full text-center text-primary-gradient"
      >
        Go back
      </Button>
    </div>
  )
}

export default PageNotFound
