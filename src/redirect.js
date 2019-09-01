import { usePath } from './router.js'
import { navigate } from './navigate.js'

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
