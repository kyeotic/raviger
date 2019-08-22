import { navigate, usePath } from './router'

export function useRedirect(
  predicateUrl,
  targetUrl,
  queryParams = null,
  replace = true
) {
  const currentPath = usePath()
  if (currentPath === predicateUrl) {
    navigate(targetUrl, queryParams, replace)
  }
}
