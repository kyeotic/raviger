import React, { useState, useMemo } from 'react'
import RouterContext from './context.js'
import { isNode, setSsrPath, getSsrPath } from './node'
import { getCurrentPath, usePopState } from './path.js'

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

export function setPath(path) {
  if (!isNode) {
    throw new Error('This method should only be used in NodeJS environments')
  }
  const url = require('url') // eslint-disable-line import/no-nodejs-modules
  setSsrPath(url.resolve(getSsrPath(), path))
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
