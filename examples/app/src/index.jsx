import React, { useState, useContext } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Link, Outlet, useLocation } from 'react-router-dom'
import KeepAliveLayout, { useKeepOutlets, KeepAliveContext } from 'keepalive'

const Layout = () => {
  const { pathname } = useLocation()
  console.log(pathname)
  const element = useKeepOutlets()
  return (
    <div>
      <div>当前路由:{pathname}</div>
      <div style={{ marginTop: '40px' }}>{element}</div>
    </div>
  )
}

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
      <p>{count}</p>
      <p>
        <button onClick={() => setCount((count) => count + 1)}> Click Me! Add!</button>
      </p>
    </span>
  )
}

const Users = () => {
  const { pathname } = useLocation()
  const [count, setCount] = useState(0)
  const { dropByCacheKey } = useContext(KeepAliveContext)

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

const Me = () => {
  return (
    <>
      <p> Me </p> <Link to="/">go Home</Link>
    </>
  )
}

const App = () => {
  return (
    <KeepAliveLayout keepalive={[/./]}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Hello />} />
            <Route path="/users" element={<Users />} />
            <Route path="/me" element={<Me />} />
          </Route>
        </Routes>
      </HashRouter>
    </KeepAliveLayout>
  )
}

const root = ReactDOM.createRoot(document.getElementById('m-ny'))
root.render(React.createElement(App))
