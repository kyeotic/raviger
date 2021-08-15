import { useLayoutEffect } from 'react'

import { getCurrentHash, usePath } from './path'
import { navigate } from './navigate'
import { QueryParam, useQueryParams } from './querystring'

export interface RedirectProps {
  to: string
  query?: QueryParam | URLSearchParams
  replace?: boolean
  merge?: boolean
}

export interface UseRedirectProps {
  predicateUrl: string
  targetUrl: string
  queryParams?: QueryParam | URLSearchParams
  replace?: boolean
}

export function Redirect({
  to,
  query,
  replace = true,
  merge = true,
}: RedirectProps): JSX.Element | null {
  useRedirect(usePath(), to, { query, replace, merge })
  return null
}

export function useRedirect(
  predicateUrl: string | null,
  targetUrl: string,
  {
    query,
    replace = true,
    merge = true,
  }: { query?: QueryParam; replace?: boolean; merge?: boolean } = {}
): void {
  const currentPath = usePath()
  const [currentQuery] = useQueryParams()
  const hash = getCurrentHash()

  let url = targetUrl
  const targetQuery = new URLSearchParams({
    ...(merge ? currentQuery : {}),
    ...query,
  }).toString()
  if (targetQuery) {
    url += '?' + targetQuery
  }
  if (merge && hash && hash.length) {
    url += hash
  }

  useLayoutEffect(() => {
    if (currentPath === predicateUrl) {
      navigate(url, undefined, replace)
    }
  }, [predicateUrl, url, replace, currentPath])
}
