/**
 * 连接 地址头判断
 * @returns
 */
function getSocketHost() {
  const url: any = location
  const host = url.host
  const isHttps = url.protocol === 'https:'
  return `${isHttps ? 'wss' : 'ws'}://${host}`
}

if ('WebSocket' in window) {
  // 连接
  const socket = new WebSocket(getSocketHost(), 'm-ny-hmr')

  let pingTimer: NodeJS.Timer | null = null
  // 接听服务器发回的信息并处理展示
  socket.addEventListener('message', async ({ data }) => {
    data = JSON.parse(data)
    if (data.type === 'connected') {
      console.log(`[m-ny] 建立联系.`)
      // 心跳包 保活
      pingTimer = setInterval(() => socket.send('ping'), 30000)
    }
    if (data.type === 'reload') {
      console.log(`[m-ny] 刷新页面.`)
      window.location.reload()
    }
  })

  /**
   * 无限重连
   * @param ms
   */
  async function waitForSuccessfulPing(ms = 1000) {
    while (true) {
      try {
        await fetch(`/__ny_ping`)
        break
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, ms))
      }
    }
  }

  // 结束连接
  socket.addEventListener('close', async () => {
    // 清除 保活
    if (pingTimer) clearInterval(pingTimer)
    console.info('[m-ny] 服务端结束连接，正在重新连接...')
    await waitForSuccessfulPing()
    location.reload()
  })
}
