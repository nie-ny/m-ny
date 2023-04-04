import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import path from 'path'
import type { IAppData } from './appData'
import {
  DEFAULT_GLOBAL_LAYOUTS,
  DEFAULT_OUTDIR,
  DEFAULT_PLATFORM,
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_BUILD_PORT
} from './constants'

export interface IRoute {
  element: any
  path: string
  routes?: IRoute[]
}

/**
 * 获取 {root} 目录下 .tsx 类型的文件
 * @param root
 */
const getFiles = (root: string) => {
  // existsSync 判断路径 是否存在
  if (!existsSync(root)) return []
  // readdirSync 读取目录下的内容
  return readdirSync(root).filter((file) => {
    // 文件地址
    const absFile = path.join(root, file)
    // statSync 获取有关文件的信息
    const fileStat = statSync(absFile)
    // isFile() 是否 常规文件
    const isFile = fileStat.isFile()
    if (isFile) {
      if (!/\.tsx?$/.test(file)) return false
    }
    return true
  })
}

/**
 * 将文件信息 转成 路由配置信息
 * @param files 文件信息 组
 * @param pagesPath pages 目录地址
 * @returns
 */
const filesToRoutes = (files: string[], pagesPath: string): IRoute[] => {
  return files.map((i) => {
    // basename() 返回 path 的最后一部分; extname() 返回文件扩展名
    // 文件名
    let pagePath = path.basename(i, path.extname(i))
    // 组合地址
    const element = path.resolve(pagesPath, pagePath)
    if (pagePath === 'home') pagePath = ''
    return {
      path: `/${pagePath}`,
      element
    }
  })
}

/**
 * 获取完整的路由信息
 * @param appData 元配置信息
 * @returns
 */
export const getRoutes = ({ appData }: { appData: IAppData }) => {
  return new Promise((resolve: (value: IRoute[]) => void) => {
    const files = getFiles(appData.paths.absPagesPath)
    const routes = filesToRoutes(files, appData.paths.absPagesPath)
    // 获取约定路径 layouts
    const layoutPath = path.resolve(appData.paths.absSrcPath, DEFAULT_GLOBAL_LAYOUTS)
    if (!existsSync(layoutPath)) {
      resolve(routes)
    } else {
      resolve([
        {
          path: '/',
          element: layoutPath.replace(path.extname(layoutPath), ''),
          routes: routes
        }
      ])
    }
  })
}
