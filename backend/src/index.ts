import 'dotenv/config'
import app from './app'
import env from './config/env'

const server = app.listen(env.port, () => {
  console.log(`[server] Running on PORT ${env.port} (${env.nodeEnv})`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[server] SIGTERM received — shutting down gracefully')
  server.close(() => {
    console.log('[server] Closed')
    process.exit(0)
  })
})

export default app
