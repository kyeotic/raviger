import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from './context.js'
import { isNode, getSsrPath } from './node.js'
import { isFunction } from './typeChecks.js'

export function usePath(basePath) {
  let context = useRouter()
  let [path, setPath] = useState(context.path || getCurrentPath(basePath))
  useLocationChange(setPath, {
    basePath,
    isActive: !context.path
  })
  return context.path || path
}

export function useBasePath() {
  return useRouter().basePath
}

export function getCurrentPath(basePath = '') {
  return isNode
    ? getSsrPath()
    : window.location.pathname.replace(basePathMatcher(basePath), '') || '/'
}

export function useLocationChange(setFn, options = {}) {
  if (isNode) return
  let basePath = ''
  const routerBasePath = useBasePath()
  if (options.inheritBasePath !== false) basePath = routerBasePath
  else if (options.basePath) basePath = options.basePath
  const setRef = useRef()
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
  return new RegExp('^' + basePath)
}
