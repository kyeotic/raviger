import { useState, useEffect, useCallback, useRef, useContext } from 'react'
import { BasePathContext, PathContext } from './context.js'
import { isNode, getSsrPath } from './node.js'
import { isFunction } from './typeChecks.js'

export function usePath(basePath) {
  const contextPath = useContext(PathContext)

  const contextBasePath = useBasePath() // hooks can't be called conditionally
  basePath = basePath || contextBasePath
  const [path, setPath] = useState(getCurrentPath(basePath))
  useLocationChange(setPath, { basePath, inheritBasePath: !basePath })

  return (
    (contextPath !== null
      ? contextPath
      : path.replace(basePathMatcher(basePath), '')) || '/'
  )
  // return path
}

export function useBasePath() {
  return useContext(BasePathContext)
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

export function getCurrentPath(basePath = '') {
  return isNode
    ? getSsrPath()
    : window.location.pathname.replace(basePathMatcher(basePath), '') || '/'
}

export function getCurrentHash() {
  if (isNode) {
    let path = getSsrPath() || ''
    let hashIndex = path.indexOf('#')
    return path !== -1 ? path.substring(hashIndex) : ''
  }
  return window.location.hash
}

export function useLocationChange(setFn, options = {}) {
  if (isNode) return
  let basePath = ''
  const routerBasePath = useBasePath()
  if (options.inheritBasePath !== false) basePath = routerBasePath
  if (!basePath && options.basePath) basePath = options.basePath
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
    if (options.isActive !== undefined && !isPredicateActive(options.isActive))
      return
    setRef.current(getCurrentPath(basePath))
  }, [options.isActive, basePath])
  useEffect(() => {
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [onPopState])
}

function isPredicateActive(predicate) {
  return isFunction(predicate) ? predicate() : predicate
}

function basePathMatcher(basePath) {
  return new RegExp('^' + basePath, 'i')
}
