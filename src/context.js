import { createContext, useContext, useMemo } from 'react'

const BasePathContext = createContext('')
const PathContext = createContext(null)

export { BasePathContext }
export { PathContext }

export function useRouter() {
  const basePath = useContext(BasePathContext)
  const path = useContext(PathContext)
  return useMemo(() => ({ basePath, path }), [basePath, path])
}
