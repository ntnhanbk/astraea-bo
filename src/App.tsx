import Layout from '@/components/layouts'
import Theme from '@/components/template/Theme'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import './locales'
import store, { persistor } from './store'

import type { Chain } from '@wagmi/core'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import appConfig from './configs/app.config'

const chains: Chain[] = [...appConfig.chain]

const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || ''
if (!projectId) throw new Error('Project ID is undefined')

const metadata = {
  name: 'Astraea Vault ',
  description: 'Astraea Vault  Description',
  url: import.meta.env.VITE_APP_URL || '',
  icons: [`${import.meta.env.VITE_APP_URL}/img/logo/logo-dark-streamline.png`],
}

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'light',
  defaultChain: appConfig.chain[0],
})

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Theme>
              <Layout />
            </Theme>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </WagmiConfig>
  )
}

export default App
