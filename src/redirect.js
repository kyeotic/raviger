import { useEffect } from 'react'
import { usePath, getCurrentHash } from './path.js'
import { navigate } from './navigate.js'
import { useQueryParams } from './querystring.js'

export function Redirect({ to, query, replace = true, merge = true }) {
  useRedirect(usePath(), to, { query, replace, merge })
  return null
}

export function useRedirect(
  predicateUrl,
  targetUrl,
  { query, replace = true, merge = true } = {}
) {
  const currentPath = usePath()
  const [currentQuery] = useQueryParams()
  const hash = getCurrentHash()
  let url = targetUrl
  const targetQuery = new URLSearchParams({
    ...(merge ? currentQuery : {}),
    ...query
  }).toString()
  if (targetQuery) {
    url += '?' + targetQuery
  }
  if (merge && hash && hash.length) {
    url += hash
  }

  useEffect(() => {
    if (currentPath === predicateUrl) {
      navigate(url, undefined, replace)
    }
  }, [predicateUrl, url, undefined, replace, currentPath])
}
