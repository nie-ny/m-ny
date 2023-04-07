import { mkdir, writeFileSync } from 'fs'
import path from 'path'
import type { IAppData } from './appData'
import type { IRoute } from './routes'
import type { UserConfig } from './config'

let count = 1
/**
 * 根据 路由配置 生成对应的 路由字符串
 * @param routes
 * @returns
 */
const getRouteStr = (routes: IRoute[]) => {
  let routesStr = ''
  let importStr = ''
  routes.forEach((route) => {
    count += 1
    importStr += `import A${count} from '${route.element}';\n`
    routesStr += `\n<Route path='${route.path}' element={<A${count} />}>`
    if (route.routes) {
      const { routesStr: rs, importStr: is } = getRouteStr(route.routes)
      routesStr += rs
      importStr += is
    }
    routesStr += '</Route>\n'
  })
  return { routesStr, importStr }
}

/**
 * 判读是否是正则表达式
 * @param config
 * @returns
 */
const configStringify = (config: (string | RegExp)[]) => {
  return config.map((item) => {
    if (item instanceof RegExp) {
      return item
    }
    return `'${item}'`
  })
}

/**
 * 生成入口文件
 * @param param0
 * @returns
 */
export const generateEntry = ({
  appData,
  routes,
  userConfig
}: {
  appData: IAppData
  routes: IRoute[]
  userConfig: UserConfig
}) => {
  return new Promise((resolve, rejects) => {
    count = 0
    const { routesStr, importStr } = getRouteStr(routes)
    const content = `
      import React from 'react'
      import ReactDOM from 'react-dom/client'
      import { HashRouter, Routes, Route } from 'react-router-dom'
      import KeepAliveLayout from 'keepalive'
      ${importStr}

      const App = () => {
        return (
            <KeepAliveLayout keepalive={[${configStringify(userConfig.keepalive || [])}]}>
                <HashRouter>
                    <Routes>
                        ${routesStr}
                    </Routes>
                </HashRouter>
            </KeepAliveLayout>
        );
      }
      const root = ReactDOM.createRoot(document.getElementById('m-ny'));
      root.render(React.createElement(App));
    `
    try {
      // mkdir() 异步地创建目录; path.dirname() 返回目录名
      mkdir(path.dirname(appData.paths.absEntryPath), { recursive: true }, (err) => {
        if (err) {
          rejects(err)
        }
        // writeFileSync() 将数据异步地写入文件，如果文件已存在则替换该文件
        writeFileSync(appData.paths.absEntryPath, content, 'utf-8')
        resolve({})
      })
    } catch (error) {
      rejects({})
    }
  })
}
