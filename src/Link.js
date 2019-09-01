import React, { useContext, useCallback } from 'react'
import { navigate } from './navigate'
import RouterContext from './context.js'

export default function Link(props) {
  const { basePath } = useContext(RouterContext)
  const href =
    props.href.substr(0, 1) === '/' ? basePath + props.href : props.href
  const onClick = useCallback(
    e => {
      if (!e.shiftKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault() // prevent the link from actually navigating
        navigate(e.currentTarget.href)
      }

      if (props.onClick) {
        props.onClick(e)
      }
    },
    [basePath, href]
  )
  return <a {...props} href={href} onClick={onClick} />
}
