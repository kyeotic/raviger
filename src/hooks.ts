import { useLayoutEffect, useRef } from 'react'

export function useMountedLayout(
  fn: () => any,
  deps: React.DependencyList | undefined,
  { onInitial = false } = {}
): void {
  const hasMounted = useRef(onInitial)
  useLayoutEffect(() => {
    if (!hasMounted.current) hasMounted.current = true
    else fn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
