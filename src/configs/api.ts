const BASE_URL = process.env.APP_API_URL || 'http://localhost:3001/api'

export const CONFIG_API = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`
  }
}
