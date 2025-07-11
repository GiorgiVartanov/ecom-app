import { createContext, useContext } from "react"

export const ModalContext = createContext({}) // default empty object, will be used as a fallback value

const useModal = () => useContext(ModalContext)

export default useModal
