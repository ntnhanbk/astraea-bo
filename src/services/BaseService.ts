import axios from 'axios'
import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import store, { signInSuccess, signOutSuccess } from '../store'
import { apiRefreshToken } from './AuthService'

const unauthorizedCode = [401]

const BaseService = axios.create({
  timeout: 60000,
  baseURL: import.meta.env.VITE_API_URL,
})

BaseService.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)
    let accessToken = (persistData as any).auth.session.access_token
    if (!accessToken) {
      const { auth } = store.getState()
      accessToken = auth.session.access_token
    }
    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

BaseService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error
    const originalConfig = error.config

    if (response && unauthorizedCode.includes(response.status)) {
      try {
        const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
        const persistData = deepParseJson(rawPersistData)
        const refreshToken = (persistData as any).auth.session.refresh_token
        if (refreshToken) {
          const {
            data: { refresh_token, access_token },
          } = await apiRefreshToken({ reset_token: refreshToken })
          store.dispatch(signInSuccess({ access_token, refresh_token }))
          originalConfig.headers[
            REQUEST_HEADER_AUTH_KEY
          ] = `${TOKEN_TYPE}${access_token}`
          return BaseService(originalConfig)
        }
      } catch (error) {
        console.log({ error })
        store.dispatch(signOutSuccess())
      }
    }

    return Promise.reject(error)
  }
)

export default BaseService
