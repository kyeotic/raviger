import { useState, useEffect } from 'react'
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
  useEffect(() => {
    // No predicate defaults true
    if (options.isActive !== undefined && !isPredicateActive(options.isActive))
      return
    const onPopState = () => {
      setFn(getCurrentPath(basePath))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [setFn, options.isActive, basePath])
}

function isPredicateActive(predicate) {
  return isFunction(predicate) ? predicate() : predicate
}

function basePathMatcher(basePath) {
  return new RegExp('^' + basePath)
}
