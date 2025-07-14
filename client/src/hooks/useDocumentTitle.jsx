import { useEffect, useState } from "react"

// changes document's (page's) title (and description if it was passed) to the passed value
export const useDocumentTitle = (title = "PCPal", description) => {
  const [documentTitle, setDocumentTitle] = useState(title)
  const [metaDescription, setMetaDescription] = useState(description)

  useEffect(() => {
    document.title = title
    if (description !== undefined) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement("meta")
        tag.name = "description"
        document.head.appendChild(tag)
      }
      tag.content = description
    }
  }, [title, description])

  return [documentTitle, setDocumentTitle, metaDescription, setMetaDescription]
}
