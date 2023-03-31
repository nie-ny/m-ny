import { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { KeepAliveContext } from 'keepalive'

const Users = () => {
  const { pathname } = useLocation()
  const [count, setCount] = useState(0)
  const { dropByCacheKey } = useContext(KeepAliveContext) as any

  return (
    <>
      <p> Users </p>
      <Link to="/">go Home</Link>
      <br></br>
      <Link to="/me">go Me</Link>

      <p>{count}</p>
      <p>
        <button onClick={() => setCount((count) => count + 1)}> Click Me! Add!</button>
      </p>
      <p>
        <button onClick={() => dropByCacheKey(pathname)}> Click Me! 清除缓存</button>
      </p>
    </>
  )
}

export default Users
