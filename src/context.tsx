import React, { createContext, useContext, useMemo } from 'react'

const BasePathContext = createContext('')
const PathContext = createContext<string | null>(null)

export { BasePathContext }
export { PathContext }

export function useRouter(): { basePath: string; path: string | null } {
  const [basePath, path] = [useContext(BasePathContext), useContext(PathContext)]
  return useMemo(() => ({ basePath, path }), [basePath, path])
}

export function RouterProvider({
  basePath = '',
  path,
  children,
}: {
  basePath?: string
  path?: string
  children?: React.ReactNode
}): JSX.Element {
  return (
    // The ordering here is important, the basePath will change less often
    // So putting it on the outside reduces its need to re-render
    <BasePathContext.Provider value={basePath}>
      <PathContext.Provider value={path ?? null}>{children}</PathContext.Provider>
    </BasePathContext.Provider>
  )
}
