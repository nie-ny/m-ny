import { useLocation } from 'react-router-dom'
import { useKeepOutlets } from 'keepalive'
import './index.css'

const Layout = () => {
  const { pathname } = useLocation()
  console.log(pathname)
  const element = useKeepOutlets()
  return (
    <div>
      <div className="malita-home">当前路由:{pathname}</div>
      <div style={{ marginTop: '40px' }}>{element}</div>
    </div>
  )
}

export default Layout
