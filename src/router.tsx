import React, {useMemo} from 'react'
import {usePath} from '.'
import {BasePathContext, PathContext} from './context'
import {isNode, setSsrPath, getSsrPath} from './node'
import {getFormattedPath} from './path'
import {RouteMatcher, RouteOptionParams, RouteParams} from './types'

export function useRoutes<T>(
    routes: RouteParams<T>,
    {
        basePath = '',
        routeProps = {},
        overridePathParams = true,
        matchTrailingSlash = true,
    }: RouteOptionParams = {},
): JSX.Element | null {
    /*
    This is a hack to setup a listener for the path while always using this latest path
    The issue with usePath is that, in order to not re-render nested components when
    their parent router changes the path, it uses the context's path
    But since that path has to get _set_ here in useRoutes something has to give

    If usePath returns latest it causes render thrashing
    If useRoutes hacks itself into the latest path nothing bad happens (...afaik)
  */

    const path = usePath(basePath) && getFormattedPath(basePath)

    // Get the current route
    const route = useMatchRoute(routes, path, {
        routeProps,
        overridePathParams,
        matchTrailingSlash,
    })
    // No match should not return an empty Provider, just null
    if (!route || path === null) return null
    return (
        <BasePathContext.Provider value={basePath}>
            <PathContext.Provider value={path}>{route}</PathContext.Provider>
        </BasePathContext.Provider>
    )
}

export function setPath(path: string) {
    if (!isNode) {
        throw new Error(
            'This method should only be used in NodeJS environments',
        )
    }
    const url = require('url')
    setSsrPath(url.resolve(getSsrPath(), path))
}

function useMatchRoute<T>(
    routes: RouteParams<T>,
    path: string | null,
    {
        routeProps,
        overridePathParams,
        matchTrailingSlash,
    }: Omit<RouteOptionParams, 'basePath'>,
) {
    // path.length > 1 ensure we still match on the root route "/" when matchTrailingSlash is set
    if (
        matchTrailingSlash &&
        path &&
        path[path.length - 1] === '/' &&
        path.length > 1
    ) {
        path = path.substring(0, path.length - 1)
    }
    const routeMatchers = useMemo(
        () => Object.keys(routes).map(createRouteMatcher),
        [hashRoutes(routes)],
    )
    if (path === null) return null
    // Hacky method for find + map
    let match: RegExpMatchArray | null = null
    let routeMatch = routeMatchers.find(({regex}) => {
        match = (path ?? '').match(regex)
        return !!match
    })
    if (!routeMatch || match === null) return null
    const m = match

    const props = routeMatch.groups.reduce(
        (props: {[key: string]: T}, prop, i) => {
            props[prop] = m[i + 1]
            return props
        },
        {},
    )

    // if (routeMatch === null) return null
    return routes[routeMatch.routePath](
        overridePathParams
            ? {...props, ...routeProps}
            : {...routeProps, ...props},
    )
}

function createRouteMatcher(routePath: string): RouteMatcher {
    return {
        routePath,
        regex: new RegExp(
            `${routePath.substr(0, 1) === '*' ? '' : '^'}${routePath
                .replace(/:[a-zA-Z]+/g, '([^/]+)')
                .replace(/\*/g, '')}${routePath.substr(-1) === '*' ? '' : '$'}`,
            'i',
        ),
        groups: (routePath.match(/:[a-zA-Z]+/g) ?? []).map(paramName =>
            paramName.substr(1),
        ),
    }
}

// React doesn't like when the hook dependency array changes size
// >> Warning: The final argument passed to useMemo changed size between renders. The order and size of this array must remain constant.
// It is recommended to use a hashing function to produce a single, stable value
// https://github.com/facebook/react/issues/14324#issuecomment-441489421
function hashRoutes<T>(routes: RouteParams<T>): string {
    return Object.keys(routes)
        .sort()
        .join(':')
}
