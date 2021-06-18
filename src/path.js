import {
  useState,
  useCallback,
  useRef,
  useContext,
  useLayoutEffect
} from 'react'
import { BasePathContext, PathContext } from './context.js'
import { useMountedLayout } from './hooks.js'
import { isNode, getSsrPath } from './node.js'
import { isFunction } from './typeChecks.js'
import { shouldCancelNavigation } from './intercept'

export function usePath(basePath) {
  const contextPath = useContext(PathContext)
  const contextBasePath = useBasePath() // hooks can't be called conditionally
  basePath = basePath || contextBasePath

  const [path, setPath] = useState(getFormattedPath(basePath))
  useLocationChange(setPath, { basePath, inheritBasePath: !basePath })

  return contextPath || path
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

  useLayoutEffect(() => {
    window.addEventListener('hashchange', handleHash, false)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [handleHash])

  useLocationChange(handleHash)
  return stripHash ? hash.substring(1) : hash
}

export function getCurrentPath() {
  return isNode ? getSsrPath() : window.location.pathname || '/'
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
  { inheritBasePath = true, basePath = '', isActive, onInitial = false } = {}
) {
  if (isNode) return
  const routerBasePath = useBasePath()
  if (inheritBasePath && routerBasePath) basePath = routerBasePath

  const setRef = useRef(setFn)
  useLayoutEffect(() => {
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
    if (shouldCancelNavigation()) return
    // console.log('loc', basePath || 'none', getFormattedPath(basePath))
    setRef.current(getFormattedPath(basePath))
  }, [isActive, basePath])

  useLayoutEffect(() => {
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [onPopState])

  // When the basePath changes re-check the path after the render completes
  // This allows nested contexts to get an up-to-date formatted path
  useMountedLayout(
    () => {
      if (isActive !== undefined && !isPredicateActive(isActive)) return
      setRef.current(getFormattedPath(basePath))
    },
    [basePath, isActive],
    { onInitial }
  )
}

/**
 * Returns the current path. If basePath is provided it will be removed from the front of the path.
 * If basePath is provided and the path does not begin with it will return null
 * @param {string} basePath basePath, if any
 * @return {string | null} returns path with basePath prefix removed, or null if basePath is provided and missing
 */
export function getFormattedPath(basePath) {
  const path = getCurrentPath()
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
