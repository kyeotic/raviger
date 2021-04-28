import {useCallback, useLayoutEffect} from 'react'
import {useBasePath} from '.'
import {isNode} from './node'
import {NavigateWithQuery, NavigateWithReplace, QueryParam} from './types'

const defaultPrompt = 'Are you sure you want to leave this page?'
const interceptors: Set<(e?: BeforeUnloadEvent) => string> = new Set()

export function navigate(
    url: string,
    replaceOrQuery?: QueryParam | URLSearchParams | boolean | null,
    replace?: boolean,
    state: unknown = null,
): void {
    if (typeof url !== 'string') {
        throw new Error(
            `"url" must be a string, was provided a(n) ${typeof url}`,
        )
    }
    if (Array.isArray(replaceOrQuery)) {
        throw new Error(
            '"replaceOrQuery" must be boolean, object, or URLSearchParams',
        )
    }
    if (shouldCancelNavigation()) return
    if (replaceOrQuery !== null && typeof replaceOrQuery === 'object') {
        url += '?' + new URLSearchParams(replaceOrQuery).toString()
    } else if (replace === undefined && replaceOrQuery !== undefined) {
        replace = replaceOrQuery ?? undefined
    } else if (replace === undefined && replaceOrQuery === undefined) {
        replace = false
    }
    if (replace) window.history.replaceState(state, '', url)
    else window.history.pushState(state, '', url)
    dispatchEvent(new PopStateEvent('popstate'))
}

export function useNavigationPrompt(
    predicate: boolean = true,
    prompt: string = defaultPrompt,
) {
    if (isNode) return
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLayoutEffect(() => {
        const handler = (e?: BeforeUnloadEvent): string => {
            if (predicate) return e ? cancelNavigation(e, prompt) : prompt
            return ''
        }
        addInterceptor(handler)
        return () => removeInterceptor(handler)
    }, [predicate, prompt])
}

export function shouldCancelNavigation() {
    // confirm if any interceptors return true
    return Array.from(interceptors).some(interceptor => {
        let prompt: string = interceptor()
        if (!prompt) return false
        // cancel navigation if user declines
        return !window.confirm(prompt)
    })
}

function addInterceptor(handler: (e?: BeforeUnloadEvent) => string) {
    window.addEventListener('beforeunload', handler)
    interceptors.add(handler)
}

function removeInterceptor(handler: (e?: BeforeUnloadEvent) => string) {
    window.removeEventListener('beforeunload', handler)
    interceptors.delete(handler)
}

function cancelNavigation(event: BeforeUnloadEvent, prompt: string) {
    // Cancel the event as stated by the standard.
    event.preventDefault()
    // Chrome requires returnValue to be set.
    event.returnValue = prompt
    // Return value for prompt per spec
    return prompt
}

export function useNavigate(
    optBasePath = '',
): NavigateWithReplace & NavigateWithQuery {
    const basePath = useBasePath()
    const navigateWithBasePath = useCallback<
        NavigateWithReplace & NavigateWithQuery
    >(
        (
            url: string,
            replaceOrQuery?: boolean | QueryParam | URLSearchParams,
            replace?: boolean,
        ) => {
            const base = optBasePath || basePath
            const href = url.startsWith('/') ? base + url : url
            navigate(href, replaceOrQuery, replace)
        },
        [basePath, optBasePath],
    )
    return navigateWithBasePath
}
