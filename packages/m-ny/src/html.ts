import { mkdir, writeFileSync } from 'fs'
import path from 'path'
import type { IAppData } from './appData'
import { DEFAULT_OUTDIR } from './constants'

export const generateHtml = ({ appData }: { appData: IAppData }) => {
  return new Promise((resolve, rejects) => {
    const content = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>${appData.pkg.name ?? '测试'}</title>
            <link href="/${DEFAULT_OUTDIR}/index.css" rel="stylesheet"></link>
        </head>
        
        <body>
            <div id="m-ny">
                <span>loading...</span>
            </div>
            <script src="/${DEFAULT_OUTDIR}/index.js"></script>
            <script src="/m-ny/client.js"></script>
        </body>
        </html>`
    try {
      const htmlPath = path.resolve(appData.paths.absOutputPath, 'index.html')
      // 创建 html 文件
      mkdir(path.dirname(htmlPath), { recursive: true }, (err) => {
        if (err) {
          rejects(err)
        }
        writeFileSync(htmlPath, content, 'utf-8')
        resolve({})
      })
    } catch (error) {
      rejects({})
    }
  })
}
