import cors from 'cors'
import bodyParser from 'body-parser'
import { createServer as createViteServer } from 'vite'
import type { ViteDevServer } from 'vite'
import { dbConnect } from './db'
import express, { NextFunction, Request, Response } from 'express'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'
import { commentsRouter } from './routers/commentsRouter'
import { topicsRouter } from './routers/topicsRouter'

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') })

const isDev = () => process.env.NODE_ENV === 'development'

class Server {
  private app: express.Application
  private port: number = Number(process.env.SERVER_PORT) || 3001
  private isDev: boolean = isDev()
  private distPath: string = path.dirname(
    require.resolve('client/dist/index.html')
  )
  private srcPath: string = path.dirname(require.resolve('client'))
  private ssrClientPath: string = require.resolve('client/dist-ssr/client.cjs')
  private vite: ViteDevServer | undefined

  constructor() {
    this.app = express()
    this.config()
    this.middleware()
    this.dbConnect().then(() => {
      this.routerConfig()
    })
  }

  private config() {
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json({ limit: '1mb' }))
    this.app.use(express.static(this.distPath))
  }

  private middleware() {
    if (this.isDev) {
      createViteServer({
        server: { middlewareMode: true },
        root: this.srcPath,
        appType: 'custom',
      }).then(vite => {
        this.vite = vite
        this.app.use(this.vite.middlewares)
      })
    }
  }

  private routerConfig() {
    const router = express.Router()

    const apiRouter = express.Router({ mergeParams: true })
    commentsRouter(apiRouter)
    topicsRouter(apiRouter)
    router.use('/api/v1', apiRouter)

    router.use('^/$', this.serverRenderer.bind(this))
    this.app.use(router)
  }

  private dbConnect() {
    return dbConnect()
  }

  private async serverRenderer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { isDev, vite } = this
    const url = req.originalUrl

    try {
      let template: string
      let render: () => Promise<string>

      if (!isDev) {
        template = fs.readFileSync(
          path.resolve(this.distPath, 'index.html'),
          'utf-8'
        )
        render = (await import(this.ssrClientPath)).render
      } else {
        template = fs.readFileSync(
          path.resolve(this.srcPath, 'index.html'),
          'utf-8'
        )
        template = await vite!.transformIndexHtml(url, template)
        render = (
          await vite!.ssrLoadModule(path.resolve(this.srcPath, 'ssr.tsx'))
        ).render
      }

      const appHtml = await render()

      const html = template.replace(`<!--SSR-->`, appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (isDev) {
        vite!.ssrFixStacktrace(e as Error)
      }
      next(e)
    }
  }

  public start() {
    return new Promise((resolve, reject) => {
      this.app
        .listen(this.port, () => {
          resolve(this.port)
        })
        .on('error', (err: Error) => reject(err))
    })
  }
}

export default Server
