# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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