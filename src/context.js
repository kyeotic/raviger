import { createContext, useContext } from 'react'

const RouterContext = createContext({
  basePath: '',
  path: null
})

export default RouterContext

export function useRouter() {
  return useContext(RouterContext)
}
