# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.2] - 2022-11-02
### Fixed
- `useHash` undefined error from missing prop on event

## [4.1.0] - 2022-04-24
### Added
- Support for React 18

## [4.0.0] - 2022-03-11
### Added
- `useHistory`
- `usePath`
### Changed
- **BREAKING**: `navigate` now has `options` object instead of overloads
- **BREAKING**: `useNavigate` uses updated `navigate` params
- **BREAKING**: `useLocationChange` now invokes the setter with a `RavigerLocation` object instead of the `path` string
### Fixed
-  `usePath` getting an old path if `navigate` was called during the initial render

## [3.1.0] - 2022-01-17
### Added
- `__tag` to the PopState events dispatched by `navigate`

## [3.0.0] - 2021-11-02
### Changed
- **BREAKING**: `usePath` returns `decodeURIComponent`-ed path
- **BREAKING**: `useRoutes`, `useMatch`, and `usePathParams` match paths that have been `decodeURIComponent`-ed (e.g. `/weird (route)` will match a path of `/weird%20(route)`)
- **BREAKING**: type `RouteParams` renamed to `Routes`
- **BREAKING**: `usePathParams` return type now depends on the input params. When a string it returns just the props, when an array it returns `[path, props]`
### Added
- `RouterProvider`
### Fixed
- `useRoutes` function-values to use props type `string` (was `any`)

## [2.6.0] - 2021-10-15
### Added
- `useMatch` hook
- `usePathParams` hook

## [2.5.5] - 2021-10-03
### Fixed
- `<Link basePath='/'>` not skipping context `basePath`

## [2.5.4] - 2021-08-27
### Fixed
- terser mangling `location` in querystring methods

## [2.5.3] - 2021-08-25
### Changed
- Updated transpilation to reduce size, remove Babel

## [2.5.2] - 2021-08-19
### Fixed
- `<ActiveLink>` matching in nested contexts
- `<ActiveLink>` matching for relative paths

## [2.5.0] - 2021-08-15
### Changed
- `src/` to typescript
- types are now natively generated from source and provided as declaration files
- Minimum NodeJS version is now 12

## [2.4.2] - 2021-07-16
### Fixed
- `useRoutes` not updating after an internal `<Redirect />` updates the location

## [2.4.1] - 2021-06-28
### Changed
- Rollup build to `keep_fnames` to retain component name checking

## [2.4.0] - 2021-06-28
### Added
- `navigate` support for urls with different origins (external navigation)

## [2.3.1] - 2021-06-18
### Added
- Sourcemaps to published package
### Changed
- `useNavigationPrompt` now restores scroll position after undoing navigation

## [2.3.0] - 2021-06-18
### Changed
- `useNavigationPrompt` now intercepts browser back/forward button navigation

## [2.2.0] - 2021-06-07
### Changed
- Added support for React@17 in `peerDependencies`

## [2.1.0] - 2021-05-02
### Added
- `options.onInitial` parameter for `useLocationChange` that controls the first render behavior. `default: false`.
### Fixed
- `useLocationChange` invoking the setter on initial render. This was not intended and was an unannounced change from the v1 behavior, so reverting it is not considered an API change but a bugfix.

## [2.0.2] - 2021-03-22
### Added
- `state` parameter for `navigate`

## [2.0.1] - 2021-01-07
### Removed
- `engine` requirement for 'less than' Node 15

## [2.0.0] - 2020-11-17
### Changed
- **BREAKING**: `useRoutes` and `usePath` will return `null` if `basePath` is provided and missing from path
- **BREAKING**: `useLocationChange` will invoke callback with `null` if `basePath` is provided and missing from path
- **BREAKING**: `useLocationChange` option `inheritBasePath` now accepts any false value (previously required `false` with `===`)
- **BREAKING**: `useRoutes` option `matchTrailingSlash` default to `true` (was `false`)
- **BREAKING**: removed `linkRef` prop from `Link` and `ActiveLink`, replaced with standard React `forwardRef`
- **BREAKING**: `useQueryParams` setter second argument changed from `replace` to options param with `replace` property
- **BREAKING**: `useRedirect` parameters changed to match properties on `Redirect` component
### Added
- `useFullPath` for getting the full path, ignoring any context-provided `basePath`
- Support for Node 14
- Rollup-plugin-terser for builds
### Removed
- Support for Node 8

## [1.6.0] - 2020-10-22
### Added
- `useNavigate` hook

## [1.5.1] - 2020-10-09
### Fixed
- `matchTrailingSlash` not matching on the root route `/`

## [1.5.0] - 2020-10-09
### Added
- `query` prop to `<Redirect>`

## [1.4.6] - 2020-10-07
### Fixed
- `useRoutes` path tracking with `usePath` causing improper child invocations

## [1.4.5] - 2020-07-31
### Fixed
- `navigate` handling of `replace` in edge cases for `replaceOrQuery`

## [1.4.4] - 2020-06-26
### Fixed
- `basePath` matches not using case-insensitive like route paths

## [1.4.3] - 2020-05-12
### Fixed
- `useQueryParam` using a `?` when no query is set
- typescript declaration for `useNavigationPrompt`

## [1.4.2] - 2020-04-30
### Fixed
- `useRoutes` error when changing the number of routes

## [1.4.1] - 2020-04-28
### Fixed
- `usePath` sets `inheritBasePath: false` when using provided `basePath`

## [1.4.0] - 2020-03-18
### Added
- `<Redirect>` Component
- `useHash` hook

## [1.3.0] - 2020-01-27
### Added
- `<Link basePath>` prop override.
### Fixed
- double decoding on `useQueryParams`

## [1.2.0] - 2020-01-21
### Changed
- Internal React-Context setup, reduces wasteful re-renders

## [1.1.1] - 2020-01-09
### Fixed
- `replace: false` on `setQueryParams` replacing `location.hash`

## [1.1.0] - 2019-11-21
### Added
- `linkRef` prop to `<Link>`

## [1.0.0] - 2019-11-12
### Added
- `useLocationChange`: similar to use `usePopState`, but uses different parameters
### Removed
- `usePopState` hook

## [0.5.9] - 2019-10-28
### Added
- `useNavigationPrompt` for confirming navigation changes

## [0.5.8] - 2019-10-14
### Fixed
- `<Link target="_blank" />` triggering local navigation

## [0.5.7] - 2019-09-26
### Added
- `<ActiveLink />`

## [0.5.5] - 2019-09-23
### Added
- `useRoutes` option `matchTrailingSlash`

## [0.5.4] - 2019-09-16
### Added
- typescript declarations

## [0.5.0] - 2019-09-13
### Changed
- `useRoutes` second parameter from `basePath` to `options`
### Added
- `useRoutes` option `routeProps`
- `useRoutes` option `overridePathParams`

## [0.4.0] - 2019-09-12
### Added
- `useBasePath` hook to retrieve the basePath

## [0.3.11] - 2019-09-09
### Fixed
- `<Link>` cmd key detection

## [0.3.9] - 2019-08-29
### Added
- `navigate` checks `url` param

## [0.3.8] - 2019-08-27
### Fixed
- `useRedirect` adding null query

## [0.3.6] - 2019-08-27
### Fixed
- Rollup dist output

## [0.3.4] - 2019-08-21
### Added
- `useRedirect` hook

## [0.3.3] - 2019-08-21
### Added
- `navigate(url, queryStringObj)` overload

## [0.3.2] - 2019-08-08
### Added
- rollup output for module and cjs
