import React from 'react'
import ReactDOM from 'react-dom'
const Hello = () => {
  const [text, setText] = React.useState('Hello m-ny!')
  return (
    <span
      onClick={() => {
        setText('Higgga!')
      }}
    >
      {' '}
      {text}{' '}
    </span>
  )
}
const root = ReactDOM.createRoot(document.getElementById('m-ny'))
root.render(React.createElement(Hello))
