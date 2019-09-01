import React, {
  useState,
  useEffect,
  useContext,
  useMemo,
  useCallback
} from 'react'
import { isNode, setSsrPath, getSsrPath } from './node'
import RouterContext from './context.js'
import { getQueryString, parseQuery, serializeQuery } from './querystrings.js'
import { navigate } from './navigate.js'

export function useRoutes(routes, basePath = '') {
  // path is the browser url location
  const path = getCurrentPath(basePath)
  const [context, setContext] = useState({ path })

  // Watch for location changes
  usePopState(basePath, isNode, path =>
    setContext(context => ({ ...context, path }))
  )
  const route = matchRoute(routes, path)
  if (!route) return null
  return (
    <RouterContext.Provider value={{ ...context, basePath }}>
      {route}
    </RouterContext.Provider>
  )
}

export function usePath(basePath) {
  let context = useContext(RouterContext)
  let [path, setPath] = useState(context.path || getCurrentPath(basePath))
  usePopState(basePath, isNode || context.path, setPath)
  return context.path || path
}

export function useQueryParams(
  parseFn = parseQuery,
  serializeFn = serializeQuery
) {
  const [querystring, setQuerystring] = useState(getQueryString())
  const setQueryParams = useCallback(
    (params, replace = true) => {
      params = replace ? params : { ...parseFn(querystring), ...params }
      navigate(`${getCurrentPath()}?${serializeFn(params)}`)
    },
    [querystring]
  )
  // Watch for location changes
  usePopState('', isNode, () => setQuerystring(getQueryString()))
  return [parseFn(querystring), setQueryParams]
}

export function setPath(path) {
  if (!isNode) {
    throw new Error('This method should only be used in NodeJS environments')
  }
  const url = require('url') // eslint-disable-line import/no-nodejs-modules
  setSsrPath(url.resolve(getSsrPath(), path))
}

function usePopState(basePath, predicate, setFn) {
  useEffect(() => {
    if (predicate) return
    const onPopState = () => {
      setFn(getCurrentPath(basePath))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [basePath])
}

function matchRoute(routes, path) {
  const routePaths = Object.keys(routes)
  const routeMatchers = useMemo(
    () => routePaths.map(createRouteMatcher),
    routePaths
  )
  // Hacky method for find + map
  let routeMatch
  routeMatchers.find(([routePath, regex, groups]) => {
    const match = path.match(regex)
    if (!match) return null
    const result = [routePath, {}]
    if (groups && groups.length) {
      result[1] = groups.reduce((props, prop, i) => {
        props[prop] = match[i + 1]
        return props
      }, {})
    }
    return (routeMatch = result)
  })
  if (!routeMatch) return null
  const [routePath, props] = routeMatch
  return routes[routePath](props)
}

function createRouteMatcher(routePath) {
  const route = [
    routePath,
    new RegExp(
      `${routePath.substr(0, 1) === '*' ? '' : '^'}${routePath
        .replace(/:[a-zA-Z]+/g, '([^/]+)')
        .replace(/\*/g, '')}${routePath.substr(-1) === '*' ? '' : '$'}`,
      'i'
    )
  ]

  const propList = routePath.match(/:[a-zA-Z]+/g)
  route.push(propList ? propList.map(paramName => paramName.substr(1)) : [])
  return route
}

function getCurrentPath(basePath = '') {
  return isNode
    ? getSsrPath()
    : window.location.pathname.replace(basePathMatcher(basePath), '') || '/'
}

function basePathMatcher(basePath) {
  return new RegExp('^' + basePath)
}
