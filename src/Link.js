import React, { useCallback } from 'react'
import { navigate } from './navigate'
import { usePath } from './path.js'
import { useRouter } from './context.js'

export default function Link(props) {
  let { className, activeClass, exactActiveClass, ...rest } = props
  if (!className) className = ''
  const { basePath } = useRouter()
  const path = usePath()
  const href =
    props.href.substring(0, 1) === '/' ? basePath + props.href : props.href
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
  if (exactActiveClass && path === href) className += ` ${exactActiveClass}`
  if (activeClass && path.startsWith(href)) className += ` ${activeClass}`
  return <a {...rest} className={className} href={href} onClick={onClick} />
}

function shouldTrap(e) {
  return (
    !e.defaultPrevented && // onClick prevented default
    e.button === 0 && // ignore everything but left clicks
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
  )
}
