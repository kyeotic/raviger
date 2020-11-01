import { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { BasePathContext, PathContext } from './context.js'
import { isNode, getSsrPath } from './node.js'
import { isFunction } from './typeChecks.js'

export function usePath(basePath) {
  const contextPath = useContext(PathContext)

  const contextBasePath = useBasePath() // hooks can't be called conditionally
  basePath = basePath || contextBasePath
  const [path, setPath] = useState(getCurrentPath())
  useLocationChange(setPath, { basePath, inheritBasePath: !basePath })

  // if (contextPath) return contextPath
  // return formatPath(basePath, path)

  return contextPath || formatPath(basePath, path)

  // return (
  //   (contextPath !== null
  //     ? contextPath
  //     : path.replace(basePathMatcher(basePath), '')) || '/'
  // )
  // return path
}

export function useBasePath() {
  return useContext(BasePathContext)
}

export function useFullPath() {
  const [path, setPath] = useState(getCurrentPath())
  useLocationChange(setPath, { inheritBasePath: false })

  return path || '/'
}

export function useHash({ stripHash = true } = {}) {
  const [hash, setHash] = useState(window.location.hash)
  const handleHash = useCallback(() => {
    if (window.location.hash === hash) return
    setHash(window.location.hash)
  }, [setHash])
  useEffect(() => {
    window.addEventListener('hashchange', handleHash, false)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [handleHash])
  useLocationChange(handleHash)
  return stripHash ? hash.substring(1) : hash
}

export function getCurrentPath() {
  // if (check)
  //   console.log(
  //     'path check',
  //     basePath,
  //     window.location.pathname,
  //     window.location.pathname.replace(basePathMatcher(basePath), '') || '/'
  //   )
  return isNode ? getSsrPath() : window.location.pathname || '/'
}

/**
 * Returns the current path. If basePath is provided it will be removed from the front of the path.
 * If basePath is provided and the path does not begin with it will return null
 * @param {string} basePath basePath, if any
 * @return {string | null} returns path with basePath prefix removed, or null if basePath is provided and missing
 */
export function getFormattedPath(basePath) {
  // console.log('format checl', basePath, getCurrentPath())
  return formatPath(basePath, getCurrentPath())
}

export function getCurrentHash() {
  if (isNode) {
    let path = getSsrPath() || ''
    let hashIndex = path.indexOf('#')
    return path !== -1 ? path.substring(hashIndex) : ''
  }
  return window.location.hash
}

export function useLocationChange(
  setFn,
  { inheritBasePath = true, basePath = '', isActive } = {}
) {
  if (isNode) return
  const routerBasePath = useBasePath()
  if (inheritBasePath && routerBasePath) basePath = routerBasePath
  // if (options.inheritBasePath !== false) basePath = routerBasePath
  const setRef = useRef(setFn)
  useEffect(() => {
    // setFn could be an in-render declared callback, making it unstable
    // This is a method of using an often-changing callback from React Hooks
    // https://reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback
    // While not recommended, it is the best current (16.9) available method
    // For reducing the useEffect cleanup from setFn changing every render
    setRef.current = setFn
  })
  const onPopState = useCallback(() => {
    // No predicate defaults true
    if (isActive !== undefined && !isPredicateActive(isActive)) return
    setRef.current(getFormattedPath(basePath))
  }, [isActive, basePath])
  useEffect(() => {
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [onPopState])
}

/**
 * remove the basePath from the front of path; returns null if basePath is not prefixing path
 * @param {string} basePath basePath, if any
 * @param {string} path current path
 * @return {string | null} returns path with basePath prefix removed, or null
 */
function formatPath(basePath, path) {
  // console.log(
  //   'format',
  //   basePath,
  //   path,
  //   path.toLowerCase().startsWith(basePath.toLowerCase()),
  //   path.replace(basePathMatcher(basePath), '') || '/'
  // )
  const baseMissing = basePath && !isPathInBase(basePath, path)
  if (path === null || baseMissing) return null
  return !basePath ? path : path.replace(basePathMatcher(basePath), '') || '/'
}

function isPredicateActive(predicate) {
  return isFunction(predicate) ? predicate() : predicate
}

function basePathMatcher(basePath) {
  return new RegExp('^' + basePath, 'i')
}

function isPathInBase(basePath, path) {
  return (
    basePath && path && path.toLowerCase().startsWith(basePath.toLowerCase())
  )
}
