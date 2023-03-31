import { useRef, createContext, useContext } from 'react'
import { useOutlet, useLocation, matchPath } from 'react-router-dom'
import type { FC } from 'react'

interface KeepAliveLayoutProps {
  keepalive: any[]
  keepElements?: any
  dropByCacheKey?: (path: string) => void
}

// 创建Context
export const KeepAliveContext = createContext<KeepAliveLayoutProps>({ keepalive: [], keepElements: {} })

/**
 * 是否为 要保存状态的路由
 * @param aliveList 路由名单
 * @param path 地址
 * @returnsa
 */
const isKeepPath = (aliveList: any[], path: string) => {
  let isKeep = false
  aliveList.map((item) => {
    if (item === path) {
      isKeep = true
    }
    if (item instanceof RegExp && item.test(path)) {
      isKeep = true
    }
    if (typeof item === 'string' && item.toLowerCase() === path) {
      isKeep = true
    }
  })
  return isKeep
}

/**
 *
 * @returns
 */
export function useKeepOutlets() {
  // 当前路径
  const location = useLocation()
  // useOutlet() 获取上层包裹的子组件
  const element = useOutlet()
  // 获取Context 中 设置的 缓存名单
  const { keepElements, keepalive } = useContext<any>(KeepAliveContext)
  const isKeep = isKeepPath(keepalive, location.pathname)
  if (isKeep) {
    // 通过 保存
    keepElements.current[location.pathname] = element
  }
  return (
    <>
      {Object.entries(keepElements.current).map(([pathname, element]: any) => (
        <div
          key={pathname}
          style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden auto' }}
          className="rumtime-keep-alive-layout"
          hidden={!matchPath(location.pathname, pathname)}
        >
          {element}
        </div>
      ))}
      {/* 是保存路由 隐藏 */}
      <div
        hidden={isKeep}
        style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden auto' }}
        className="rumtime-keep-alive-layout-no"
      >
        {!isKeep && element}
      </div>
    </>
  )
}

/**
 * 使用 Context 包裹 配置 keepElements组件对象 和 dropByCacheKey函数清除对应缓存
 * @param props
 * @returns
 */
const KeepAliveLayout: FC<KeepAliveLayoutProps> = (props) => {
  const { keepalive, ...other } = props
  const keepElements = useRef<any>({})
  function dropByCacheKey(path: string) {
    keepElements.current[path] = null
  }
  return <KeepAliveContext.Provider value={{ keepalive, keepElements, dropByCacheKey }} {...other} />
}

export default KeepAliveLayout
