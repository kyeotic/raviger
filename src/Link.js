import React, { useCallback } from 'react'
import { navigate } from './navigate'
import { usePath, useBasePath } from './path.js'

export default function Link(props) {
  const basePath = useBasePath()
  const href = getLinkHref(props.href, basePath)
  const onClick = useCallback(
    e => {
      try {
        if (props.onClick) props.onClick(e)
      } catch (ex) {
        e.preventDefault()
        throw ex
      }
      if (shouldTrap(e)) {
        e.preventDefault() // prevent the link from actually navigating
        navigate(e.currentTarget.href)
      }
    },
    [basePath, href, props.onClick]
  )
  return <a {...props} href={href} onClick={onClick} />
}

export function ActiveLink(props) {
  const basePath = useBasePath()
  const path = usePath(basePath)
  const href = getLinkHref(props.href, basePath)
  let { className, activeClass, exactActiveClass, ...rest } = props
  if (!className) className = ''
  if (exactActiveClass && path === href) className += ` ${exactActiveClass}`
  if (activeClass && path.startsWith(href)) className += ` ${activeClass}`
  return <Link {...rest} className={className} />
}

function getLinkHref(href, basePath = '') {
  return href.substring(0, 1) === '/' ? basePath + href : href
}

function shouldTrap(e) {
  return (
    !e.defaultPrevented && // onClick prevented default
    e.button === 0 && // ignore everything but left clicks
    !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
  )
}
