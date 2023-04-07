import { existsSync } from 'fs'
import path from 'path'
import { build } from 'esbuild'
import type { IAppData } from './appData'
import { DEFAULT_CONFIG_FILE } from './constants'

export interface UserConfig {
  title?: string
  keepalive?: any[]
}
export const getUserConfig = ({
  appData,
  sendMessage
}: {
  appData: IAppData
  sendMessage: (type: string, data?: any) => void
}) => {
  return new Promise(async (resolve: (value: UserConfig) => void, rejects) => {
    let config = {}
    // 获取配置文件地址
    const configFile = path.resolve(appData.paths.cwd, DEFAULT_CONFIG_FILE)

    if (existsSync(configFile)) {
      await build({
        format: 'cjs',
        logLevel: 'error',
        outdir: appData.paths.absOutputPath,
        bundle: true,
        define: {
          'process.env.NODE_ENV': JSON.stringify('development')
        },
        external: ['esbuild'],
        entryPoints: [configFile]
      })
      try {
        config = require(path.resolve(appData.paths.absOutputPath, 'ny.config.js')).default
      } catch (error) {
        console.error('getUserConfig error', error)
        rejects(error)
      }
    }
    resolve(config)
  })
}
