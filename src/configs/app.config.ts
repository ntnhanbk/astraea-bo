import type { Chain } from 'wagmi'
import { cronos, polygon } from 'wagmi/chains'

export type AppConfig = {
  apiPrefix: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  tourPath: string
  locale: string
  enableMock: boolean
  chain: Chain[]
}

const appConfig: AppConfig = {
  apiPrefix: '/api',
  authenticatedEntryPath: 'app/staking',
  unAuthenticatedEntryPath: '/sign-in',
  tourPath: '/app/account/kyc-form',
  locale: 'en',
  enableMock: false,
  chain: [cronos, polygon],
}

export default appConfig
