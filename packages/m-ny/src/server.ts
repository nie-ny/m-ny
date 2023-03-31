import { Server as HttpServer } from 'http'
import { WebSocketServer } from 'ws'

/**
 * 建立 Socke 连接
 * @param server
 */
export function createWebSocketServer(server: HttpServer) {
  // noServer 开启无服务模式
  // 使用 HttpServer 启动服务
  const wss = new WebSocketServer({
    noServer: true
  })

  // 监听协议升级（http协议变为Socket）
  server.on('upgrade', (req, socket, head) => {
    if (req.headers['sec-websocket-protocol'] === 'm-ny-hmr') {
      // 请求 触达升级 成功后触发 connection事件
      wss.handleUpgrade(req, socket as any, head, (ws) => {
        wss.emit('connection', ws, req)
      })
    }
  })

  // 监听 connection事件 建立连接 发送信息
  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected' }))
  })

  // 监听 error事件 打印日志
  wss.on('error', (e: Error & { code: string }) => {
    if (e.code !== 'EADDRINUSE') {
      console.error(`WebSocket server 错误:\n${e.stack || e.message}`)
    }
  })

  return {
    // 发送消息
    send(message: string) {
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(message)
        }
      })
    },
    wss,
    close() {
      wss.close()
    }
  }
}
