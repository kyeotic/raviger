import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// eslint-disable-next-line import/no-unresolved
import whyDidYouRender from 'whyDidYouRender'

whyDidYouRender(React)

ReactDOM.render(<App />, document.getElementById('root'))
