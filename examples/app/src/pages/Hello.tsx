import { useState } from 'react'
import { Link } from 'react-router-dom'
import './indexa.css'

const Hello = () => {
  const [text, setText] = useState('Hello m-ny!')
  const [count, setCount] = useState(0)

  return (
    <span
      onClick={() => {
        setText('Higgga!')
      }}
    >
      {text}

      <div>
        <Link to="/users">go Users</Link>
      </div>
      <p className="malita-hellos">{count}</p>
      <p>
        <button onClick={() => setCount((count) => count + 1)}> Click Me! Add!</button>
      </p>
    </span>
  )
}

export default Hello
