import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import KeepAliveLayout from 'keepalive'

import Layout from './layout/index'
import Hello from './pages/Hello'
import Users from './pages/Users'
import Me from './pages/Me'

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
