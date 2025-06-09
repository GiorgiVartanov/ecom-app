import { useRouteError } from "react-router"

const ErrorBoundary = () => {
  const error = useRouteError()

  return (
    <div>
      <h1>something went wrong</h1>
      <pre>{error?.message || ""}</pre>
    </div>
  )
}

export default ErrorBoundary
