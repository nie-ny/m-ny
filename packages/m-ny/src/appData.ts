import path from 'path'
import { DEFAULT_ENTRY_POINT, DEFAULT_OUTDIR, DEFAULT_TEMPLATE } from './constants'

interface IOptions {
  // 当前路径
  cwd: string
}
export interface IAppData {
  paths: {
    cwd: string
    absSrcPath: string
    absPagesPath: string
    absTmpPath: string
    absOutputPath: string
    absEntryPath: string
    absNodeModulesPath: string
  }
  pkg: any
}

export const getAppData = ({ cwd }: IOptions) => {
  return new Promise((resolve: (value: IAppData) => void, rejects) => {
    // src 目录绝对路径
    const absSrcPath = path.resolve(cwd, 'src')
    // pages 目录绝对路径
    const absPagesPath = path.resolve(absSrcPath, 'pages')
    // node_modules 目录绝对路径
    const absNodeModulesPath = path.resolve(cwd, 'node_modules')
    // 临时目录绝对路径
    const absTmpPath = path.resolve(absNodeModulesPath, DEFAULT_TEMPLATE)
    // 主入口文件的绝对路径
    const absEntryPath = path.resolve(absTmpPath, DEFAULT_ENTRY_POINT)
    // 输出目录绝对路径
    const absOutputPath = path.resolve(cwd, DEFAULT_OUTDIR)

    const paths = {
      cwd,
      absSrcPath,
      absPagesPath,
      absTmpPath,
      absOutputPath,
      absEntryPath,
      absNodeModulesPath
    }
    // 当前项目的 package.json，格式为 Object。
    const pkg = require(path.resolve(cwd, 'package.json'))
    resolve({ paths, pkg })
  })
}
