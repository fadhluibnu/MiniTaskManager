import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import env from './config/env'
import router from './routes'
import { notFoundMiddleware } from './middlewares/not-found.middleware'
import { errorMiddleware } from './middlewares/error.middleware'

const app = express()

// Security headers
app.use(helmet())
app.disable('x-powered-by')

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, mobile apps)
      if (!origin) return callback(null, true)

      if (env.nodeEnv !== 'production') {
        // In development, allow all origins
        return callback(null, true)
      }

      if (env.allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      callback(new Error(`CORS policy: origin ${origin} not allowed`))
    },
    credentials: true
  })
)

// Request logging (dev only)
if (env.nodeEnv !== 'production') {
  app.use(morgan('dev'))
}

// Body parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API routes
app.use('/api', router)

// 404 handler — must come after all routes
app.use(notFoundMiddleware)

// Global error handler — must be last
app.use(errorMiddleware)

export default app
