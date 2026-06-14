/**
 * Environment variable configuration.
 * All env values must be accessed via this file — never hardcode them.
 */
const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL as string,
} as const

export default env
