import { useLayoutEffect, useRef } from 'react'

export function useMountedLayout(
  fn: () => unknown,
  deps: React.DependencyList | undefined,
  { onInitial = false } = {},
): void {
  const hasMounted = useRef(onInitial)
  useLayoutEffect(() => {
    if (!hasMounted.current) hasMounted.current = true
    else fn()
  }, deps)
}
