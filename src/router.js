import React, { useState, useEffect, useContext, createContext, useMemo, useCallback } from 'react'
import isNode from './isNode'
import RouterContext from './context.js'
import { parseQuery, serializeQuery } from './querystrings.js'

let ssrPath = '/'

export function useRoutes(routes, basePath = '') {
  // path is the browser url location
  const path = getCurrentPath(basePath)
  const [context, setContext] = useState({ path })

  // Watch for location changes
  usePopState(basePath, isNode, path => setContext(context => ({ ...context, path })))
  const route = matchRoute(routes, path)
  return <RouterContext.Provider value={{ ...context, basePath }}>{route}</RouterContext.Provider>
}

export function navigate(url, replace = false) {
  window.history[`${replace ? 'replace' : 'push'}State`](null, null, url)
  dispatchEvent(new PopStateEvent('popstate', null))
}

export function usePath(basePath) {
  let context = useContext(RouterContext)
  let [path, setPath] = useState(context.path || getCurrentPath(basePath))
  usePopState(basePath, isNode || context.path, setPath)
  return context.path || path
}

export function useQueryParams(parseFn = parseQuery, serializeFn = serializeQuery) {
  const [querystring, setQuerystring] = useState(getQueryString())
  const setQueryParams = useCallback(
    (params, replace = true) => {
      params = replace ? params : { ...parseQuery(querystring), ...params }
      navigate(`${getCurrentPath()}?${serializeQuery(params)}`)
    },
    [querystring]
  )
  // Watch for location changes
  usePopState('', isNode, () => setQuerystring(getQueryString()))
  return [parseQuery(querystring), setQueryParams]
}

export function setPath(path) {
  if (!isNode) {
    throw new Error('This method should only be used in NodeJS environments')
  }
  const url = require('url')
  ssrPath = url.resolve(ssrPath, path)
}

function usePopState(basePath, predicate, setFn) {
  useEffect(() => {
    if (predicate) return
    const onPopState = e => {
      setFn(getCurrentPath(basePath))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [basePath])
}

function getQueryString() {
  if (isNode) {
    let queryIndex = ssrPath.indexOf('?')
    return queryIndex === -1 ? '' : ssrPath.substring(queryIndex + 1)
  }
  return location.search
}

function matchRoute(routes, path) {
  const routePaths = Object.keys(routes)
  const routeMatchers = useMemo(() => routePaths.map(createRouteMatcher), routePaths)
  // Hacky method for find + map
  let routeMatch
  routeMatchers.find(([routePath, regex, groups]) => {
    const match = path.match(regex)
    if (!match) return
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

/**
 * Create a matching set that can Regex match on a route and collect its token properties
 *
 * @param {String} routePath path for a route, should be the KEY on the routes object
 * @returns [String routepath, RegExp routeMatcher, RegExp propMatcher]
 */
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
  return isNode ? ssrPath : window.location.pathname.replace(basePathMatcher(basePath), '') || '/'
}

function basePathMatcher(basePath) {
  return new RegExp('^' + basePath)
}
