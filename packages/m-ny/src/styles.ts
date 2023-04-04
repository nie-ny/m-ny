import esbuild, { Plugin } from 'esbuild'

// -----------------------------------
// 废弃 版本原因 import css from ${JSON.stringify(args.path)} 打包工具报错 未找到原因 正在找

// https://github.com/evanw/esbuild/issues/20#issuecomment-802269745
export function style(): Plugin {
  return {
    name: 'style',
    setup({ onResolve, onLoad }) {
      // 获取所有css 文件 归内到style-stub
      onResolve({ filter: /\.css$/, namespace: 'file' }, (args) => {
        console.log('🚀 ~ file: styles.ts:10 ~ onResolve ~ args:', args.path)

        return { path: args.path, namespace: 'style-stub' }
      })

      // 获取 style-stub 组的导入  修改内容
      onLoad({ filter: /.*/, namespace: 'style-stub' }, async (args) => ({
        contents: `
            import { injectStyle } from "__style_helper__"
            import css from ${JSON.stringify(args.path)}
            injectStyle(css)
          `
      }))

      // 获取 上面添加的__style_helper__ 导入  归内到style-helper
      onResolve({ filter: /^__style_helper__$/, namespace: 'style-stub' }, (args) => ({
        path: args.path,
        namespace: 'style-helper',
        sideEffects: false
      }))

      // 获取 style-helper 组的导入  修改内容
      onLoad({ filter: /.*/, namespace: 'style-helper' }, async () => ({
        contents: `
                export function injectStyle(text) {
                  if (typeof document !== 'undefined') {
                    var style = document.createElement('style')
                    var node = document.createTextNode(text)
                    style.appendChild(node)
                    document.head.appendChild(style)
                  }
                }
              `
      }))

      // 获取 style-stub 下的css 导入 归内到style-content
      onResolve({ filter: /\.css$/, namespace: 'style-stub' }, (args) => {
        return { path: args.path, namespace: 'style-content' }
      })

      // 获取 style-content 下的文件 编译成文本导出
      onLoad(
        {
          filter: /.*/,
          namespace: 'style-content'
        },
        async (args) => {
          const { errors, warnings, outputFiles } = await esbuild.build({
            entryPoints: [args.path],
            logLevel: 'silent',
            bundle: true,
            write: false,
            charset: 'utf8',
            minify: true,
            loader: {
              '.svg': 'dataurl',
              '.ttf': 'dataurl'
            }
          })
          return {
            errors,
            warnings,
            contents: outputFiles![0].text,
            loader: 'text'
          }
        }
      )
    }
  }
}
