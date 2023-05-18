import express from 'express'
import { config as Config } from '../config/index.js'
import methodOverride from 'method-override'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import expressSession from 'express-session'
import connectRedis from 'connect-redis'
import cors from 'cors'
import { directory } from './system/directory.js'
import { environment } from './system/environment.js'
import { routes } from './routes/index.js'
import { createLegacyClient } from './db/redis.js'

const PORT = Config.port
const RedisStore = connectRedis(expressSession)
const app = express()
const frontLimit = 1024 * 1024 * 50

export default function initialize() {
  app.use(express.static(directory + '/public'))
  app.use(methodOverride())
  app.use(cookieParser())
  app.use(
    express.urlencoded({
      parameterLimit: 50000,
      limit: frontLimit,
      extended: true,
    }),
  )
  app.use(morgan('tiny'))
  app.use(
    express.json({
      limit: frontLimit,
    }),
  )
  app.use(
    expressSession({
      key: `${Config.name}-${environment}.sid`,
      resave: true,
      store: new RedisStore({
        client: createLegacyClient(),
      }),
      secret: `${Config.secret}-${environment}`,
      saveUninitialized: true,
      cookie: {
        iAmInitial: true,
        // set the maximum session age to a month
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'Lax',
      },
    }),
  )
  app.use(cors())
  app.set('port', PORT)

  routes({ app })

  return app
}
