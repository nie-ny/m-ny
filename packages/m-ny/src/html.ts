import { mkdir, writeFileSync } from 'fs'
import path from 'path'
import type { IAppData } from './appData'
import type { UserConfig } from './config'
import { DEFAULT_OUTDIR } from './constants'

export const generateHtml = ({ appData, userConfig }: { appData: IAppData; userConfig: UserConfig }) => {
  return new Promise((resolve, rejects) => {
    const title = userConfig?.title ?? appData.pkg.name ?? 'ny'
    const content = `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
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
