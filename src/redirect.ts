import { useLayoutEffect } from 'react'

import { getCurrentHash, usePath } from './location'
import { navigate, NavigateOptions } from './navigate'
import { QueryParam, useQueryParams } from './querystring'

export interface RedirectProps extends NavigateOptions {
  to: string
  merge?: boolean
}

export interface UseRedirectProps {
  predicateUrl: string
  targetUrl: string
  queryParams?: QueryParam | URLSearchParams
  replace?: boolean
  state?: unknown
}

export function Redirect({
  to,
  query,
  replace = true,
  merge = true,
  state,
}: RedirectProps): JSX.Element | null {
  useRedirect(usePath(), to, { query, replace, merge, state })
  return null
}

export function useRedirect(
  predicateUrl: string | null,
  targetUrl: string,
  {
    query,
    replace = true,
    merge = true,
    state,
  }: { query?: QueryParam; replace?: boolean; merge?: boolean; state?: unknown } = {},
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
      navigate(url, { replace, state })
    }
  }, [predicateUrl, url, replace, currentPath, state])
}
