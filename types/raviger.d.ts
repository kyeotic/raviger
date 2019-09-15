import * as React from 'react'

export function useRoutes(
  routes: Dict<string, (props: Object) => JSX.Element>,
  {
    basePath,
    routeProps,
    overridePathParams
  }: { basePath: string; routeProps: Object; overridePathParams: boolean }
): JSX.Element

export function useRedrect(
  predicateUrl: string,
  targetUrl: string,
  queryParams: Object | URLSearchParams,
  replace: boolean
): void

export class Link extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function navigate(url: string, replace: boolean): void
export function navigate(
  url: string,
  query: Object | URLSearchParams,
  replace: boolean
): void

export function usePath(basePath: string): string

export function useBasePath(): string

export function usePopState(
  basePath: string,
  predicate: () => boolean,
  setFn: (path: string) => any
): void

export function useQueryParams(
  parseFn: (query: string) => Object,
  serializeFn: (query: Object) => string
): [Object, (query: Object) => void]
