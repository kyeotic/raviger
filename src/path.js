import { useState, useEffect } from 'react'
import { useRouter } from './context.js'
import { isNode, getSsrPath } from './node.js'

export function usePath(basePath) {
  let context = useRouter()
  let [path, setPath] = useState(context.path || getCurrentPath(basePath))
  usePopState(basePath, isNode || context.path, setPath)
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

export function usePopState(basePath, predicate, setFn) {
  useEffect(() => {
    if (predicate) return
    const onPopState = () => {
      setFn(getCurrentPath(basePath))
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [basePath])
}

function basePathMatcher(basePath) {
  return new RegExp('^' + basePath)
}
