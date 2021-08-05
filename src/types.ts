export interface RouteParams<T> {
    [key: string]: (props: {[k: string]: T}) => JSX.Element
}

export interface RouteOptionParams {
    basePath?: string
    routeProps?: {[k: string]: any}
    overridePathParams?: boolean
    matchTrailingSlash?: boolean
}

export interface QueryParam {
    [key: string]: any
}

export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    basePath?: string
}
export type LinkRef = HTMLAnchorElement | null

export interface ActiveLinkProps extends LinkProps {
    activeClass?: string
    exactActiveClass?: string
}

export interface RedirectProps {
    to: string
    query?: QueryParam | URLSearchParams
    replace?: boolean
    merge?: boolean
}

export interface UseRedirectProps {
    predicateUrl: string
    targetUrl: string
    queryParams?: QueryParam | URLSearchParams
    replace?: boolean
}

export interface RouteMatcher {
    routePath: string
    regex: RegExp
    groups: string[]
}

export interface LocationChangeSetFkt {
    (path: string | null): void
}
export interface LocationChangeOptionParams {
    inheritBasePath?: boolean
    basePath?: string
    isActive?: boolean | (() => boolean)
}

export interface NavigateWithReplace {
    (url: string, replace?: boolean): void
}
export interface NavigateWithQuery {
    (url: string, query?: QueryParam | URLSearchParams, replace?: boolean): void
}

export interface setQueryParamsOptions {
    replace?: boolean
}
