import express from 'express'
import { context, build } from 'esbuild'
import type { ServeOnRequestArgs } from 'esbuild'
import path from 'path'
import portfinder from 'portfinder'
import { createServer } from 'http'
import {
  DEFAULT_ENTRY_POINT,
  DEFAULT_OUTDIR,
  DEFAULT_PLATFORM,
  DEFAULT_PORT,
  DEFAULT_HOST,
  DEFAULT_BUILD_PORT
} from './constants'
import { createWebSocketServer } from './server'
// import { style } from './styles'
import { getAppData } from './appData'
import { getRoutes } from './routes'

export const dev = async () => {
  // 进程执行时的文件夹地址——工作目录
  const cwd = process.cwd()
  const app = express()

  // 判断 端口号
  const port = await portfinder.getPortPromise({
    port: DEFAULT_PORT
  })

  // 打包后文件地址
  const esbuildOutput = path.resolve(cwd, DEFAULT_OUTDIR)

  app.get('/', (_req: any, res: any) => {
    res.set('Content-Type', 'text/html')
    res.send(`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <title>m-ny</title>
        <link href="/${DEFAULT_OUTDIR}/index.css" rel="stylesheet"></link>
    </head>
    
    <body>
        <div id="m-ny">
            <span>loading...</span>
        </div>
        <script src="/${DEFAULT_OUTDIR}/index.js"></script>
        <script src="/malita/client.js"></script>
    </body>
    </html>`)
  })

  app.use(`/${DEFAULT_OUTDIR}`, express.static(esbuildOutput))
  // 客户端代码加入静态管理器
  app.use(`/malita`, express.static(path.resolve(__dirname, 'client')))

  // 使用 http 搭建express服务
  const malitaServe = createServer(app)
  // 建立 Socket连接
  const ws = createWebSocketServer(malitaServe)

  // 发送消息
  function sendMessage(type: string, data?: any) {
    ws.send(JSON.stringify({ type, data }))
  }

  malitaServe.listen(DEFAULT_PORT, async () => {
    console.log(`App listening at http://${DEFAULT_HOST}:${port}`)

    try {
      // 获取项目元信息
      const appData = await getAppData({
        cwd
      })
      // 获取 routes 配置
      const routes = await getRoutes({ appData })
      console.log('🚀 ~ file: dev.ts:78 ~ malitaServe.listen ~ routes:', routes)

      // 构建更新 插件
      let examplePlugin = {
        name: 'example',
        setup(build: any) {
          build.onEnd((result: any) => {
            // 新构建结束时得到通知
            console.log(`构建更新`)
            // 更新页面
            sendMessage('reload')
          })
        }
      }

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
        external: ['esbuild'],
        // 入口文件
        entryPoints: [path.resolve(cwd, DEFAULT_ENTRY_POINT)],
        plugins: [examplePlugin]
      })

      // // 启动 esbuild服务
      ctx.serve({
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
      ctx.watch()
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  })
}
