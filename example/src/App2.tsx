import React from 'react'
import {
  useRoutes,
  Link,
  usePath,
  useQueryParams,
  Redirect,
  navigate
} from '../../src/main.js'

const PROJECTS = [
  'ac2fd99a-495a-498a-843c-b7ddd7f7bf3f',
  'b986a8e3-3f92-4112-9cda-506a1ca28ef0'
]
const BrandingPage = ({ projectId }) => {
  return React.createElement(
    'h2',
    null,
    'BrandingPage content for project ',
    projectId
  )
}
function ProjectArea({ projectId }) {
  const match = useRoutes(
    React.useMemo(
      () => ({
        '/settings/branding': () =>
          React.createElement(BrandingPage, { projectId: projectId })
      }),
      [projectId]
    ),
    {
      basePath: `/projects/${projectId}`
    }
  )
  return React.createElement(
    'div',
    { style: { display: 'flex', flexDirection: 'column' } },
    React.createElement('h1', null, 'Raviger issue'),
    React.createElement(
      'select',
      {
        onChange: React.useCallback(e => {
          navigate(`/projects/${e.target.value}/settings/branding`)
        }, []),
        value: projectId
      },
      React.createElement('option', { value: PROJECTS[0] }, PROJECTS[0]),
      React.createElement('option', { value: PROJECTS[1] }, PROJECTS[1])
    ),
    match !== null && match !== void 0
      ? match
      : React.createElement('h2', null, '404')
  )
}
export default function App() {
  const match = useRoutes(
    React.useMemo(
      () => ({
        '/projects/:projectId*': ({ projectId }) =>
          React.createElement(ProjectArea, { projectId: projectId })
      }),
      []
    )
  )
  React.useLayoutEffect(() => {
    const index = Math.round(Math.random()) // the initial projectId doesn't matter
    navigate(`/projects/${PROJECTS[index]}/settings/branding`)
  }, [])
  return match !== null && match !== void 0
    ? match
    : React.createElement('h2', null, '404')
}
