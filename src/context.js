import { createContext, useContext } from 'react'

const BasePathContext = createContext('')
const PathContext = createContext(null)

export { BasePathContext }
export { PathContext }

export function useRouter() {
  return {
    basePath: useContext(BasePathContext),
    path: useContext(PathContext)
  }
}
