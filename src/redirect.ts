import {useLayoutEffect} from 'react'
import {usePath, useQueryParams, navigate} from '.'
import {getCurrentHash} from './path'
import {RedirectProps, QueryParam} from './types'

export function Redirect({
    to,
    query,
    replace = true,
    merge = true,
}: RedirectProps) {
    useRedirect(usePath(), to, {query, replace, merge})
    return null
}

export function useRedirect(
    predicateUrl: string | null,
    targetUrl: string,
    {
        query,
        replace = true,
        merge = true,
    }: {query?: QueryParam; replace?: boolean; merge?: boolean} = {},
) {
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
    }, [predicateUrl, url, undefined, replace, currentPath])
}
