import React, { Children } from 'react'

export default function Nav({ children }) {
  return (
    <ul className="nav">
      {Children.map(children, child => (
        <li>{child}</li>
      ))}
    </ul>
  )
}
