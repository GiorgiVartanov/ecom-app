import { useEffect, useState } from "react"

// changes document's (page's) title to the passed value
export const useDocumentTitle = (title = "PCPal") => {
  const [documentTitle, setDocumentTitle] = useState(title)

  useEffect(() => {
    document.title = documentTitle
  }, [documentTitle])

  return [documentTitle, setDocumentTitle]
}
