import React, { useMemo } from 'react'
import { BasePathContext, PathContext } from './context.js'
import { isNode, setSsrPath, getSsrPath } from './node'
import { usePath } from './path.js'

export function useRoutes(
  routes,
  {
    basePath = '',
    routeProps = {},
    overridePathParams = true,
    matchTrailingSlash = false
  } = {}
) {
  // path is the browser url location
  const path = usePath(basePath)
  // Get the current route
  const route = matchRoute(routes, path, {
    routeProps,
    overridePathParams,
    matchTrailingSlash
  })
  // No match should not return an empty Provider, just null
  if (!route) return null
  return (
    <BasePathContext.Provider value={basePath}>
      <PathContext.Provider value={path}>{route}</PathContext.Provider>
    </BasePathContext.Provider>
  )
}

export function setPath(path) {
  if (!isNode) {
    throw new Error('This method should only be used in NodeJS environments')
  }
  const url = require('url') // eslint-disable-line import/no-nodejs-modules
  setSsrPath(url.resolve(getSsrPath(), path))
}

function matchRoute(
  routes,
  path,
  { routeProps, overridePathParams, matchTrailingSlash }
) {
  if (matchTrailingSlash && path && path[path.length - 1] === '/') {
    path = path.substring(0, path.length - 1)
  }
  const routeMatchers = useMemo(
    () => Object.keys(routes).map(createRouteMatcher),
    [routes]
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
  return routes[routePath](
    overridePathParams
      ? { ...props, ...routeProps }
      : { ...routeProps, ...props }
  )
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
