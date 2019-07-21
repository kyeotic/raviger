import { createContext } from 'react'

const RouterContext = createContext({
  basePath: '',
  path: null
})
export default RouterContext
