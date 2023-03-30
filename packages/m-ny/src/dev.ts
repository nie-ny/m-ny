import express from 'express'
import { context, build } from 'esbuild'
import type { ServeOnRequestArgs } from 'esbuild'
import path from 'path'
import {
  DEFAULT_ENTRY_POINT,
  DEFAULT_OUTDIR,
  DEFAULT_PLATFORM,
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_BUILD_PORT
} from './constants'

export const dev = async () => {
  // 进程执行时的文件夹地址——工作目录
  const cwd = process.cwd()

  const app = express()

  // app.get('/', (_req: any, res: any) => {
  //   res.send('Helo m-ny! ---------')
  // })

  app.get('/', (_req: any, res: any) => {
    res.set('Content-Type', 'text/html')
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>m-ny</title>
    </head>
    
    <body>
        <div id="m-ny">
            <span>loading...</span>
        </div>
        <script src="http://${DEFAULT_HOST}:${DEFAULT_BUILD_PORT}/index.js"></script>
    </body>
    </html>`)
  })

  app.listen(DEFAULT_PORT, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${DEFAULT_PORT}`)

    try {
      // 配置打包信息
      let ctx = await context({
        // iife格式代表“立即调用的函数表达式”，旨在在浏览器中运行。
        format: 'iife',
        // 错误日志
        logLevel: 'error',
        // 输出地址
        outdir: DEFAULT_OUTDIR,
        // 平台
        platform: DEFAULT_PLATFORM,
        // 捆绑
        bundle: true,
        // 环境变量
        define: {
          'process.env.NODE_ENV': JSON.stringify('development')
        },
        // 入口文件
        entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)]
      })
      // 启动 esbuild服务
      const devServe = ctx.serve({
        port: DEFAULT_BUILD_PORT,
        host: DEFAULT_HOST,
        // 启动目录
        servedir: DEFAULT_OUTDIR,
        onRequest: (args: ServeOnRequestArgs) => {
          if (args.timeInMS) {
            console.log(`${args.method}: ${args.path} ${args.timeInMS} ms`)
          }
        }
      })

      // 监听回掉
      process.on('SIGINT', () => {
        // devServe
        process.exit(0)
      })
      process.on('SIGTERM', () => {
        // devServe.stop()
        process.exit(1)
      })
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  })
}
