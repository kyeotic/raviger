import {createContext, useContext, useMemo} from 'react'

const BasePathContext = createContext('')
const PathContext = createContext<string | null>(null)

export {BasePathContext}
export {PathContext}

export function useRouter() {
    const [basePath, path] = [
        useContext(BasePathContext),
        useContext(PathContext),
    ]
    return useMemo(() => ({basePath, path}), [basePath, path])
}
