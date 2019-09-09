import React, { useCallback } from 'react'
import { navigate } from './navigate'
import { useRouter } from './context.js'

export default function Link(props) {
  const { basePath } = useRouter()
  const href =
    props.href.substr(0, 1) === '/' ? basePath + props.href : props.href
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
    [basePath, href]
  )
  return <a {...props} href={href} onClick={onClick} />
}

function shouldTrap(e) {
  return (
    !e.defaultPrevented && // onClick prevented default
    e.button === 0 && // ignore everything but left clicks
    !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
  )
}
