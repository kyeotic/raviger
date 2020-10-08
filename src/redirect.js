import { useEffect } from 'react'
import { usePath, getCurrentHash } from './path.js'
import { navigate } from './navigate.js'
import { useQueryParams, deriveQueryString } from './querystring.js'

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

export function Redirect({ to, query, replace = true, merge = true }) {
  const [currentQuery] = useQueryParams()
  const hash = getCurrentHash()
  const path = usePath()
  let url = to
  const targetQuery = deriveQueryString(currentQuery, query, merge)
  if (targetQuery) {
    url += '?' + targetQuery
  }
  if (merge && hash && hash.length) {
    url += hash
  }
  useRedirect(path, url, null, replace)
  return null
}
