import 'dotenv/config'

/**
 * Centralized environment variable configuration.
 * All env values must be accessed via this module — never use process.env directly.
 */
const env = {
  nodeEnv: (process.env.NODE_ENV || 'development') as
    | 'development'
    | 'production'
    | 'test',
  port: parseInt(process.env.PORT || '8000', 10),
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  dataDir: process.env.DATA_DIR || 'src/data'
} as const

export default env
