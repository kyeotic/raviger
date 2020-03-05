import { useEffect } from 'react'
import { usePath, getCurrentHash } from './path.js'
import { navigate } from './navigate.js'
import { useQueryParams } from './querystring.js'

// TODO: V2 replace this signature with one more like the <Redirect /> Component
export function useRedirect(
  predicateUrl,
  targetUrl,
  queryParams = null,
  replace = true
) {
  const currentPath = usePath()
  useEffect(() => {
    if (currentPath === predicateUrl) {
      navigate(targetUrl, queryParams, replace)
    }
  }, [predicateUrl, targetUrl, queryParams, replace, currentPath])
}

export function Redirect({ to, replace = true, merge = true }) {
  const [query] = useQueryParams()
  const hash = getCurrentHash()
  const path = usePath()
  let url = to
  if (merge) {
    if (Object.keys(query).length)
      url += '?' + new URLSearchParams(query).toString()
    if (hash && hash.length) url += hash
  }
  useRedirect(path, url, null, replace)
  return null
}
